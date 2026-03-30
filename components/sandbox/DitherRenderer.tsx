"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";

// 4x4 Bayer matrix (normalized 0-1 range), encoded as float array
const BAYER_4X4 = [
  0 / 16, 8 / 16, 2 / 16, 10 / 16,
  12 / 16, 4 / 16, 14 / 16, 6 / 16,
  3 / 16, 11 / 16, 1 / 16, 9 / 16,
  15 / 16, 7 / 16, 13 / 16, 5 / 16,
];

const DITHER_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// Simplex noise blob vertex shader (from sensory project)
const BLOB_VERTEX = `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uNoiseFreq;
  uniform float uWaveAmp;

  varying vec3 vNormal;
  varying vec3 vViewPosition;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float getNoise(vec2 uv, float scale) {
    return snoise(uv * scale) * 0.5 + 0.5;
  }

  void main() {
    float timeOffset = -(uSpeed * uTime);
    vec2 noiseUV = vec2(timeOffset + position.x * 0.5, position.y + position.z * 0.5);
    float noise = getNoise(noiseUV, uNoiseFreq);
    float displacement = noise * uWaveAmp;
    vec3 newPosition = position + normal * displacement;

    // Approximate displaced normal via finite differences
    float eps = 0.01;
    vec2 noiseUV_dx = vec2(timeOffset + (position.x + eps) * 0.5, position.y + position.z * 0.5);
    vec2 noiseUV_dz = vec2(timeOffset + position.x * 0.5, position.y + (position.z + eps) * 0.5);
    float noise_dx = getNoise(noiseUV_dx, uNoiseFreq) * uWaveAmp;
    float noise_dz = getNoise(noiseUV_dz, uNoiseFreq) * uWaveAmp;
    vec3 tangent = normalize(vec3(eps, noise_dx - displacement, 0.0));
    vec3 bitangent = normalize(vec3(0.0, noise_dz - displacement, eps));
    vec3 displacedNormal = normalize(cross(tangent, bitangent));
    // Blend with original normal for stability
    vNormal = normalize(normalMatrix * mix(normal, displacedNormal, 0.5));

    vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Simple diffuse+specular fragment for luminance variation
const BLOB_FRAGMENT = `
  precision highp float;

  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPosition);

    // Key light
    vec3 lightDir = normalize(vec3(3.0, 4.0, 2.0));
    float diffuse = max(dot(N, lightDir), 0.0);

    // Fill light
    vec3 fillDir = normalize(vec3(-2.0, 1.0, -1.0));
    float fill = max(dot(N, fillDir), 0.0) * 0.3;

    // Specular
    vec3 halfDir = normalize(lightDir + V);
    float spec = pow(max(dot(N, halfDir), 0.0), 32.0) * 0.4;

    float luma = 0.15 + diffuse * 0.6 + fill + spec;
    gl_FragColor = vec4(vec3(luma), 1.0);
  }
`;

const DITHER_FRAGMENT = `
  precision highp float;

  uniform sampler2D uSceneTexture;
  uniform vec2 uResolution;
  uniform float uPixelScale;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorBg;
  uniform float uBayer[16];

  varying vec2 vUv;

  void main() {
    // Pixelate UVs based on scale
    vec2 pixelSize = uPixelScale / uResolution;
    vec2 pixelUv = floor(vUv / pixelSize) * pixelSize + pixelSize * 0.5;

    // Sample scene
    vec4 color = texture2D(uSceneTexture, pixelUv);

    // Luminance
    float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));

    // Bayer threshold lookup
    vec2 cellPos = mod(gl_FragCoord.xy / uPixelScale, 4.0);
    int index = int(cellPos.x) + int(cellPos.y) * 4;

    // Manual array lookup (GLSL ES doesn't support dynamic indexing well)
    float threshold = 0.0;
    for (int i = 0; i < 16; i++) {
      if (i == index) {
        threshold = uBayer[i];
        break;
      }
    }

    float isObject = step(0.01, luma);
    float dithered = step(threshold, luma);
    vec3 lightColor = mix(uColorBg, uColorB, isObject);
    vec3 finalColor = mix(uColorA, lightColor, dithered);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const DEFAULT_BLOB_COLOR = "#00D177";

export interface DitherRendererHandle {
  flashColor: () => void;
}

const WANDER_PALETTE = [
  // Vibrant
  "#FF4900", "#EE0050", "#5F2DFF", "#75F000", "#00B4FF",
  "#FF00AA", "#FFD600", "#00FFC8", "#FF6B35", "#8B00FF",
  // Saturated mid
  "#E8453C", "#2D9CDB", "#27AE60", "#F2994A", "#9B51E0",
  // Subdued / desaturated
  "#7A8B6E", "#A89078", "#6B7F99", "#9E8A7C", "#708078",
];

const WANDER_DURATION = 3.0;
const WANDER_STOPS = 5;

type ColorPhase = "idle" | "wandering" | "returning";

function pickWanderColors(currentColor: THREE.Color): THREE.Color[] {
  var colors: THREE.Color[] = [currentColor.clone()];
  var available = [...WANDER_PALETTE];
  for (var i = 0; i < WANDER_STOPS; i++) {
    var idx = Math.floor(Math.random() * available.length);
    colors.push(new THREE.Color(available.splice(idx, 1)[0]));
  }
  return colors;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

export const DitherRenderer = forwardRef<DitherRendererHandle>(
  function DitherRenderer(_, ref) {
    var containerRef = useRef<HTMLDivElement>(null);
    var frameRef = useRef<number>(0);
    var materialRef = useRef<THREE.ShaderMaterial | null>(null);
    var phaseRef = useRef<{ phase: ColorPhase; startTime: number; waypoints: THREE.Color[] }>({
      phase: "idle",
      startTime: 0,
      waypoints: [],
    });
    var defaultColor = useRef(new THREE.Color(DEFAULT_BLOB_COLOR));

    useImperativeHandle(ref, () => ({
      flashColor() {
        var current = materialRef.current
          ? materialRef.current.uniforms.uColorB.value
          : defaultColor.current;
        phaseRef.current.waypoints = pickWanderColors(current);
        phaseRef.current.phase = "wandering";
        phaseRef.current.startTime = -1;
      },
    }));

    useEffect(() => {
      var container = containerRef.current;
      if (!container) return;

      // --- Scene (pass 1): animated blob ---
      var scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);

      var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
      camera.position.set(0, 0, 4.5);
      camera.lookAt(0, 0, 0);

      var renderer = new THREE.WebGLRenderer({ antialias: false });
      renderer.setPixelRatio(1);
      container.appendChild(renderer.domElement);

      // Blob
      var clock = new THREE.Clock();
      var geometry = new THREE.SphereGeometry(0.975, 128, 128);
      var blobMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uSpeed: { value: 0.6 },
          uNoiseFreq: { value: 0.96 },
          uWaveAmp: { value: 1.06 },
        },
        vertexShader: BLOB_VERTEX,
        fragmentShader: BLOB_FRAGMENT,
      });
      var blob = new THREE.Mesh(geometry, blobMaterial);
      scene.add(blob);

      // --- Render target (offscreen framebuffer) ---
      var renderTarget = new THREE.WebGLRenderTarget(512, 512);

      // --- Dither pass (pass 2): fullscreen quad ---
      var ditherScene = new THREE.Scene();
      var ditherCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      var ditherMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uSceneTexture: { value: renderTarget.texture },
          uResolution: { value: new THREE.Vector2(512, 512) },
          uPixelScale: { value: 1.5 },
          uColorA: { value: new THREE.Color(0x0a0e14) },
          uColorB: { value: new THREE.Color(DEFAULT_BLOB_COLOR) },
          uColorBg: { value: new THREE.Color("#e8e4d9") },
          uBayer: { value: BAYER_4X4 },
        },
        vertexShader: DITHER_VERTEX,
        fragmentShader: DITHER_FRAGMENT,
      });
      materialRef.current = ditherMaterial;

      var quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), ditherMaterial);
      ditherScene.add(quad);

      // --- Resize ---
      function resize() {
        var w = container!.clientWidth;
        var h = container!.clientHeight;
        renderer.setSize(w, h);
        renderTarget.setSize(w, h);
        ditherMaterial.uniforms.uResolution.value.set(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      resize();

      var resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);

      // --- Animate ---
      var tempColor = new THREE.Color();

      function animate() {
        frameRef.current = requestAnimationFrame(animate);

        if (document.hidden) return;

        var elapsed = clock.getElapsedTime();
        blobMaterial.uniforms.uTime.value = elapsed;
        blob.rotation.y = elapsed * 0.15;
        blob.rotation.x = Math.sin(elapsed * 0.1) * 0.1;

        // Color phase state machine
        var p = phaseRef.current;
        var colorB = ditherMaterial.uniforms.uColorB.value;

        if (p.phase === "idle") {
          colorB.lerp(defaultColor.current, 0.04);
        } else if (p.phase === "wandering") {
          if (p.startTime < 0) p.startTime = elapsed;
          var dt = elapsed - p.startTime;
          var t = Math.min(dt / WANDER_DURATION, 1.0);

          // Map t to a position along the waypoint chain
          var segments = p.waypoints.length - 1;
          var segPos = t * segments;
          var segIdx = Math.min(Math.floor(segPos), segments - 1);
          var segT = smoothstep(segPos - segIdx);

          tempColor.copy(p.waypoints[segIdx]).lerp(p.waypoints[segIdx + 1], segT);
          colorB.copy(tempColor);

          if (dt >= WANDER_DURATION) {
            p.phase = "returning";
            p.startTime = elapsed;
          }
        } else if (p.phase === "returning") {
          if (p.startTime < 0) p.startTime = elapsed;
          var dt = elapsed - p.startTime;
          colorB.lerp(defaultColor.current, 0.06);
          if (dt >= 1.0) {
            p.phase = "idle";
          }
        }

        // Pass 1: render scene to offscreen target
        renderer.setRenderTarget(renderTarget);
        renderer.render(scene, camera);

        // Pass 2: render dithered result to screen
        renderer.setRenderTarget(null);
        renderer.render(ditherScene, ditherCamera);
      }
      frameRef.current = requestAnimationFrame(animate);

      // --- Cleanup ---
      return () => {
        resizeObserver.disconnect();
        cancelAnimationFrame(frameRef.current);
        renderer.dispose();
        renderTarget.dispose();
        geometry.dispose();
        blobMaterial.dispose();
        ditherMaterial.dispose();
        container!.removeChild(renderer.domElement);
      };
    }, []);

    return (
      <div
        ref={containerRef}
        className="w-full h-full"
      />
    );
  }
);
