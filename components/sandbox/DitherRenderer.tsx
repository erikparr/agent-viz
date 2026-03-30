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

const DITHER_FRAGMENT = `
  precision highp float;

  uniform sampler2D uSceneTexture;
  uniform vec2 uResolution;
  uniform float uPixelScale;
  uniform vec3 uBgColor;
  uniform vec3 uBgLineColor;
  uniform float uBgLineSpacing;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uBayer[16];

  varying vec2 vUv;

  void main() {
    // Pixelate UVs based on scale
    vec2 pixelSize = uPixelScale / uResolution;
    vec2 pixelUv = floor(vUv / pixelSize) * pixelSize + pixelSize * 0.5;

    vec4 color = texture2D(uSceneTexture, pixelUv);

    // Background: dither between bgColor and bgLineColor
    if (color.a < 0.01) {
      float cell = 6.0;
      vec2 cellId = floor(gl_FragCoord.xy / cell);
      float skip = mod(cellId.x + cellId.y, 3.0);
      vec2 c = mod(gl_FragCoord.xy, cell) - cell * 0.5;
      float diag1 = abs(c.x - c.y);
      float diag2 = abs(c.x + c.y);
      float d = step(min(diag1, diag2), 0.5) * skip;
      gl_FragColor = vec4(mix(uBgColor, uBgLineColor, d), 1.0);
      return;
    }

    // Object: dither between colorA (dark) and colorB (light)
    float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));

    // Bayer threshold lookup
    vec2 cellPos = mod(gl_FragCoord.xy / uPixelScale, 4.0);
    int index = int(cellPos.x) + int(cellPos.y) * 4;

    float threshold = 0.0;
    for (int i = 0; i < 16; i++) {
      if (i == index) {
        threshold = uBayer[i];
        break;
      }
    }

    float dithered = step(threshold, luma);
    vec3 finalColor = mix(uColorA, uColorB, dithered);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export interface DitherRendererHandle {
  setColors: (bg: string, bgLine: string, a: string, b: string) => void;
}

export const DitherRenderer = forwardRef<DitherRendererHandle>(
  function DitherRenderer(_, ref) {
    var containerRef = useRef<HTMLDivElement>(null);
    var frameRef = useRef<number>(0);
    var targetBgColor = useRef(new THREE.Color(0x0a0e14));
    var targetBgLineColor = useRef(new THREE.Color(0xffffff));
    var targetColorA = useRef(new THREE.Color(0x0a2a30));
    var targetColorB = useRef(new THREE.Color(0x4a9ead));
    var materialRef = useRef<THREE.ShaderMaterial | null>(null);

    useImperativeHandle(ref, () => ({
      setColors(bg: string, bgLine: string, a: string, b: string) {
        targetBgColor.current.set(bg);
        targetBgLineColor.current.set(bgLine);
        targetColorA.current.set(a);
        targetColorB.current.set(b);
      },
    }));

    useEffect(() => {
      var container = containerRef.current;
      if (!container) return;

      // --- Scene (pass 1): rotating cube ---
      var scene = new THREE.Scene();
      scene.background = null; // transparent so alpha distinguishes object from bg

      var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
      camera.position.set(2, 1.5, 2);
      camera.lookAt(0, 0, 0);

      var renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      renderer.setPixelRatio(1);
      renderer.setClearColor(0x000000, 0); // transparent clear
      container.appendChild(renderer.domElement);

      // Cube
      var geometry = new THREE.BoxGeometry(1, 1, 1);
      var cubeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.4,
        metalness: 0.1,
      });
      var cube = new THREE.Mesh(geometry, cubeMaterial);
      scene.add(cube);

      // Lighting
      var ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
      scene.add(ambientLight);

      var directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
      directionalLight.position.set(3, 4, 2);
      scene.add(directionalLight);

      var fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
      fillLight.position.set(-2, 1, -1);
      scene.add(fillLight);

      // --- Render target (offscreen framebuffer) ---
      var renderTarget = new THREE.WebGLRenderTarget(512, 512, {
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType,
      });

      // --- Dither pass (pass 2): fullscreen quad ---
      var ditherScene = new THREE.Scene();
      var ditherCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      var ditherMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uSceneTexture: { value: renderTarget.texture },
          uResolution: { value: new THREE.Vector2(512, 512) },
          uPixelScale: { value: 1.5 },
          uBgColor: { value: new THREE.Color(0x0a0e14) },
          uBgLineColor: { value: new THREE.Color(0xffffff) },
          uBgLineSpacing: { value: 12.0 },
          uColorA: { value: new THREE.Color(0x0a2a30) },
          uColorB: { value: new THREE.Color(0x4a9ead) },
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
      var lerpSpeed = 0.04;

      function animate() {
        frameRef.current = requestAnimationFrame(animate);

        if (document.hidden) return;

        cube.rotation.x += 0.008;
        cube.rotation.y += 0.012;

        // Lerp colors toward targets
        ditherMaterial.uniforms.uBgColor.value.lerp(targetBgColor.current, lerpSpeed);
        ditherMaterial.uniforms.uBgLineColor.value.lerp(targetBgLineColor.current, lerpSpeed);
        ditherMaterial.uniforms.uColorA.value.lerp(targetColorA.current, lerpSpeed);
        ditherMaterial.uniforms.uColorB.value.lerp(targetColorB.current, lerpSpeed);

        // Pass 1: render scene to offscreen target
        renderer.setRenderTarget(renderTarget);
        renderer.clearColor();
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
        cubeMaterial.dispose();
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
