"use client";

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";

var iridescenceVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vec4 mvPosition = viewMatrix * worldPosition;
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

var isSafari =
  typeof navigator !== "undefined" &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

var createFragmentShader = (useLowQuality = false) => `
  uniform float uTime;
  uniform float uThickness;
  uniform float uFresnelPower;
  uniform vec3 uBaseColor;
  uniform vec3 uEnvColor1;
  uniform vec3 uEnvColor2;
  uniform vec3 uEnvColor3;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  const float IOR = 1.33;
  const float PI = 3.14159265359;
  vec3 wavelengthToRGB(float wavelength) {
    float w = clamp(wavelength, 380.0, 780.0);
    vec3 rgb;
    if (w < 440.0) { rgb = vec3(-(w - 440.0) / 60.0, 0.0, 1.0); }
    else if (w < 490.0) { rgb = vec3(0.0, (w - 440.0) / 50.0, 1.0); }
    else if (w < 510.0) { rgb = vec3(0.0, 1.0, -(w - 510.0) / 20.0); }
    else if (w < 580.0) { rgb = vec3((w - 510.0) / 70.0, 1.0, 0.0); }
    else if (w < 645.0) { rgb = vec3(1.0, -(w - 645.0) / 65.0, 0.0); }
    else { rgb = vec3(1.0, 0.0, 0.0); }
    float factor;
    if (w < 420.0) { factor = 0.3 + 0.7 * (w - 380.0) / 40.0; }
    else if (w > 700.0) { factor = 0.3 + 0.7 * (780.0 - w) / 80.0; }
    else { factor = 1.0; }
    return rgb * factor;
  }
  vec3 thinFilmInterference(float cosTheta, float thickness) {
    vec3 color = vec3(0.0);
    ${useLowQuality
      ? `for (float w = 420.0; w <= 680.0; w += 52.0) {`
      : `for (float w = 400.0; w <= 700.0; w += 20.0) {`
    }
      float delta = 2.0 * IOR * thickness * cosTheta;
      float phase = 2.0 * PI * delta / w;
      float intensity = 0.5 + 0.5 * cos(phase + PI);
      color += wavelengthToRGB(w) * intensity;
    }
    ${useLowQuality ? "color /= 6.0;" : "color /= 16.0;"}
    return color;
  }
  float fresnel(vec3 viewDir, vec3 normal, float power) {
    float NdotV = max(dot(normal, viewDir), 0.0);
    return pow(1.0 - NdotV, power);
  }
  vec3 sampleEnvironment(vec3 reflectDir) {
    float y = reflectDir.y * 0.5 + 0.5;
    float x = atan(reflectDir.z, reflectDir.x) / (2.0 * PI) + 0.5;
    vec3 topColor = uEnvColor1;
    vec3 midColor = uEnvColor2;
    vec3 bottomColor = uEnvColor3;
    float noise = sin(x * 20.0 + uTime * 0.5) * 0.1 + sin(y * 15.0 - uTime * 0.3) * 0.1;
    vec3 envColor;
    if (y > 0.5) { envColor = mix(midColor, topColor, (y - 0.5) * 2.0); }
    else { envColor = mix(bottomColor, midColor, y * 2.0); }
    return envColor * (1.0 + noise);
  }
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    float cosTheta = abs(dot(normal, viewDir));
    float thicknessVariation = sin(vUv.x * 10.0 + uTime) * 0.1
                              + sin(vUv.y * 8.0 - uTime * 0.7) * 0.1
                              + sin(length(vWorldPosition) * 5.0 + uTime * 0.5) * 0.05;
    float thickness = uThickness * (1.0 + thicknessVariation);
    vec3 interferenceColor = thinFilmInterference(cosTheta, thickness) * 1.5;
    float fresnelFactor = fresnel(viewDir, normal, uFresnelPower);
    vec3 reflectDir = reflect(-viewDir, normal);
    vec3 envReflection = sampleEnvironment(reflectDir) * 1.3;
    vec3 baseContrib = uBaseColor * (1.0 - fresnelFactor) * 0.4;
    vec3 iridContrib = interferenceColor * (0.7 + fresnelFactor * 0.5);
    vec3 envContrib = envReflection * fresnelFactor * 0.8;
    vec3 finalColor = baseContrib + iridContrib + envContrib;
    vec3 emissive = vec3(0.15, 0.2, 0.25) + interferenceColor * 0.2;
    finalColor += emissive;
    float edgeGlow = pow(1.0 - cosTheta, 2.5) * 0.5;
    finalColor += vec3(0.9, 0.95, 1.0) * edgeGlow;
    finalColor = finalColor / (finalColor * 0.5 + vec3(1.0));
    float alpha = 0.9 + fresnelFactor * 0.1;
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

var BASE_ASPECT = 16 / 9;
var BASE_FOV = 35;
var MAX_FOV = 65;

function calculateResponsiveFOV(width: number, height: number) {
  var aspect = width / height;
  var fov = BASE_FOV;
  if (aspect < BASE_ASPECT) {
    fov = BASE_FOV * (BASE_ASPECT / aspect);
    fov = Math.min(fov, MAX_FOV);
  }
  return fov;
}

function calculateCameraZ(contentWidth: number, contentHeight: number, fov: number, aspect: number) {
  var vFovRad = (fov * Math.PI) / 180;
  var hFovRad = 2 * Math.atan(Math.tan(vFovRad / 2) * aspect);
  var padding = 1.15;
  var zForWidth = (contentWidth * padding) / (2 * Math.tan(hFovRad / 2));
  var zForHeight = (contentHeight * padding) / (2 * Math.tan(vFovRad / 2));
  var z = Math.max(zForWidth, zForHeight);
  if (aspect > BASE_ASPECT) {
    var widenessFactor = aspect / BASE_ASPECT;
    z *= 1 + (widenessFactor - 1) * (2 / 3);
  }
  return z;
}

interface FoamLogo3DProps {
  className?: string;
}

export function FoamLogo3D({ className = "" }: FoamLogo3DProps) {
  var containerRef = useRef<HTMLDivElement>(null);
  var [webglFailed, setWebglFailed] = useState(false);
  var isContextLostRef = useRef(false);
  var contextLossCountRef = useRef(0);

  useEffect(() => {
    var container = containerRef.current;
    if (!container) return;

    var initialized = false;
    var scene: THREE.Scene;
    var camera: THREE.PerspectiveCamera;
    var renderer: THREE.WebGLRenderer;
    var clock: THREE.Clock;
    var dracoLoader: DRACOLoader;
    var bubbleGeometry: THREE.SphereGeometry;
    var sceneContentWidth = 0;
    var sceneContentHeight = 0;
    var animationId = 0;
    var lastTime = performance.now();
    var letterMeshes: THREE.Mesh[] = [];
    var bubbles: { mesh: THREE.Mesh; speed: number; wobblePhase: number; wobbleSpeed: number; baseX: number }[] = [];

    var createIridescentMaterial = () => {
      return new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uThickness: { value: 300.0 },
          uFresnelPower: { value: 2.5 },
          uBaseColor: { value: new THREE.Color(0.05, 0.05, 0.1) },
          uEnvColor1: { value: new THREE.Color(1.0, 0.3, 0.9) },
          uEnvColor2: { value: new THREE.Color(0.3, 1.0, 0.8) },
          uEnvColor3: { value: new THREE.Color(0.3, 0.4, 1.0) },
        },
        vertexShader: iridescenceVertexShader,
        fragmentShader: createFragmentShader(isSafari),
        transparent: true,
        side: THREE.DoubleSide,
      });
    };

    var resetBubble = (bubble: typeof bubbles[0], randomY: boolean) => {
      bubble.baseX = (Math.random() - 0.5) * 8;
      bubble.mesh.position.x = bubble.baseX;
      bubble.mesh.position.y = randomY ? (Math.random() - 0.5) * 5 : -3.5 - Math.random();
      bubble.mesh.position.z = 1 + Math.random() * 1.5;
      bubble.speed = 0.3 + Math.random() * 0.4;
      bubble.wobblePhase = Math.random() * Math.PI * 2;
      bubble.wobbleSpeed = 1 + Math.random() * 1.5;
      var size = 0.015 + Math.random() * 0.04;
      bubble.mesh.scale.setScalar(size);
    };

    var initScene = (width: number, height: number) => {
      if (initialized || !container) return;
      initialized = true;

      scene = new THREE.Scene();
      var initialFOV = calculateResponsiveFOV(width, height);
      camera = new THREE.PerspectiveCamera(initialFOV, width / height, 0.1, 1000);
      camera.position.z = 6;

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: isSafari ? "low-power" : "high-performance",
        failIfMajorPerformanceCaveat: false,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSafari ? 1.5 : 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);

      var canvas = renderer.domElement;
      canvas.addEventListener("webglcontextlost", (e) => {
        e.preventDefault();
        isContextLostRef.current = true;
        contextLossCountRef.current++;
        if (animationId) cancelAnimationFrame(animationId);
        if (contextLossCountRef.current >= 5) setWebglFailed(true);
      });
      canvas.addEventListener("webglcontextrestored", () => {
        isContextLostRef.current = false;
        if (contextLossCountRef.current >= 3) return;
        letterMeshes.forEach((mesh) => { (mesh.material as THREE.ShaderMaterial).dispose(); mesh.material = createIridescentMaterial(); });
        bubbles.forEach((b) => { (b.mesh.material as THREE.ShaderMaterial).dispose(); b.mesh.material = createIridescentMaterial(); });
        clock.start();
        animate();
      });

      scene.add(new THREE.AmbientLight(0xffffff, 0.3));
      var keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
      keyLight.position.set(5, 5, 5);
      scene.add(keyLight);
      var fillLight = new THREE.DirectionalLight(0x88ccff, 0.6);
      fillLight.position.set(-5, 2, 3);
      scene.add(fillLight);
      var rimLight = new THREE.DirectionalLight(0xff00ff, 0.8);
      rimLight.position.set(0, -3, -5);
      scene.add(rimLight);
      var pointLight1 = new THREE.PointLight(0x00ffff, 1.0, 20);
      pointLight1.position.set(3, 2, 4);
      scene.add(pointLight1);
      var pointLight2 = new THREE.PointLight(0xff88ff, 0.8, 20);
      pointLight2.position.set(-3, -1, 4);
      scene.add(pointLight2);

      clock = new THREE.Clock();

      bubbleGeometry = new THREE.SphereGeometry(1, 12, 8);
      for (var i = 0; i < 20; i++) {
        var mesh = new THREE.Mesh(bubbleGeometry, createIridescentMaterial());
        var bubble = { mesh, speed: 0, wobblePhase: 0, wobbleSpeed: 0, baseX: 0 };
        resetBubble(bubble, true);
        bubbles.push(bubble);
        scene.add(mesh);
      }

      dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
      var loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);
      loader.setMeshoptDecoder(MeshoptDecoder);

      var letters = ["F", "O", "A", "M"];
      var letterSpacing = 2.5;
      var startX = -((letters.length - 1) * letterSpacing) / 2;
      var loadedCount = 0;

      letters.forEach((letter, index) => {
        loader.load(
          `/foam-logo-3d/optimized/${letter}.glb`,
          (gltf) => {
            var model = gltf.scene;
            model.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.material = createIridescentMaterial();
                letterMeshes.push(child);
              }
            });
            model.rotation.x = Math.PI / 2;
            model.position.x = startX + index * letterSpacing;
            var box = new THREE.Box3().setFromObject(model);
            var size = box.getSize(new THREE.Vector3());
            var maxDim = Math.max(size.x, size.y, size.z);
            model.scale.setScalar(2.0 / maxDim);
            box.setFromObject(model);
            var center = box.getCenter(new THREE.Vector3());
            model.position.y -= center.y;
            scene.add(model);
            loadedCount++;
            if (loadedCount === letters.length) {
              var sceneBounds = new THREE.Box3();
              letterMeshes.forEach((m) => sceneBounds.expandByObject(m));
              var sceneSize = sceneBounds.getSize(new THREE.Vector3());
              sceneContentWidth = sceneSize.x;
              sceneContentHeight = sceneSize.y;
              camera.position.z = calculateCameraZ(sceneContentWidth, sceneContentHeight, camera.fov, camera.aspect);
              camera.position.y = 1;
            }
          },
          undefined,
          () => {
            var geo = new THREE.BoxGeometry(1.5, 2, 0.5);
            var mat = createIridescentMaterial();
            var m = new THREE.Mesh(geo, mat);
            m.position.x = startX + index * letterSpacing;
            scene.add(m);
            letterMeshes.push(m);
          }
        );
      });

      var animate = () => {
        if (isContextLostRef.current) return;
        animationId = requestAnimationFrame(animate);
        var elapsed = clock.getElapsedTime();
        var now = performance.now();
        var deltaTime = (now - lastTime) / 1000;
        lastTime = now;

        letterMeshes.forEach((lm, idx) => {
          if ((lm.material as THREE.ShaderMaterial).uniforms) {
            (lm.material as THREE.ShaderMaterial).uniforms.uTime.value = elapsed;
          }
          var floatOffset = Math.sin(elapsed * 0.8 + idx * 0.5) * 0.1;
          var floatY = Math.sin(elapsed * 0.6 + idx * 0.7) * 0.05;
          if (lm.parent) {
            lm.parent.position.y = floatOffset;
            lm.parent.rotation.z = floatY * 0.1;
          }
          lm.rotation.y = Math.sin(elapsed * 0.3 + idx * 0.2) * 0.15;
        });

        bubbles.forEach((b) => {
          b.mesh.position.y += b.speed * deltaTime;
          var wobble = Math.sin(elapsed * b.wobbleSpeed + b.wobblePhase) * 0.15;
          b.mesh.position.x = b.baseX + wobble;
          if (b.mesh.position.y > 3.5) resetBubble(b, false);
          var mat = b.mesh.material as THREE.ShaderMaterial;
          if (mat.uniforms) mat.uniforms.uTime.value = elapsed;
        });

        camera.position.x = Math.sin(elapsed * 0.3) * 0.4;
        camera.lookAt(0.5, 1, 0);
        renderer.render(scene, camera);
      };
      animate();
    };

    var handleResize = (entries: ResizeObserverEntry[]) => {
      var { width, height } = entries[0].contentRect;
      if (width === 0 || height === 0) return;
      if (!initialized) { initScene(width, height); return; }
      camera.aspect = width / height;
      camera.fov = calculateResponsiveFOV(width, height);
      if (sceneContentWidth > 0) {
        camera.position.z = calculateCameraZ(sceneContentWidth, sceneContentHeight, camera.fov, camera.aspect);
      }
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    var resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (animationId) cancelAnimationFrame(animationId);
      if (dracoLoader) dracoLoader.dispose();
      if (bubbleGeometry) bubbleGeometry.dispose();
      bubbles.forEach((b) => { (b.mesh.material as THREE.ShaderMaterial).dispose(); if (scene) scene.remove(b.mesh); });
      letterMeshes.forEach((m) => { (m.material as THREE.ShaderMaterial).dispose(); m.geometry.dispose(); });
      if (renderer) {
        renderer.dispose();
        var c = renderer.domElement;
        if (container?.contains(c)) container.removeChild(c);
      }
    };
  }, []);

  if (webglFailed) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-bg-primary ${className}`}>
        <span className="text-2xl font-bold text-text-primary tracking-widest">FOAM</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden bg-bg-primary ${className}`}
    />
  );
}
