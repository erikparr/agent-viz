"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface CrosshatchBackgroundProps {
  agentStatus?: "idle" | "running" | "completed" | "error";
}

export function CrosshatchBackground({ agentStatus = "idle" }: CrosshatchBackgroundProps) {
  var canvasRef = useRef<HTMLCanvasElement>(null);
  var rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  var frameRef = useRef<number>(0);
  var statusRef = useRef(agentStatus);

  statusRef.current = agentStatus;

  useEffect(() => {
    var canvas = canvasRef.current;
    if (!canvas) return;

    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    var renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    // Crosshatch shader
    var material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2() },
        uIntensity: { value: 0.06 },
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform float uIntensity;

        float line(vec2 uv, float angle, float spacing, float thickness) {
          float c = cos(angle);
          float s = sin(angle);
          float d = abs(mod(uv.x * c + uv.y * s + uTime * 0.02, spacing) - spacing * 0.5);
          return smoothstep(thickness, thickness + 0.5, d);
        }

        void main() {
          vec2 uv = gl_FragCoord.xy;
          float spacing = 18.0;
          float thickness = 0.3;

          // Two crossing line sets
          float l1 = line(uv, 0.785, spacing, thickness);
          float l2 = line(uv, -0.785, spacing + 4.0, thickness);

          // Combine
          float pattern = min(l1, l2);
          float alpha = (1.0 - pattern) * uIntensity;

          gl_FragColor = vec4(vec3(1.0), alpha);
        }
      `,
    });

    var geometry = new THREE.PlaneGeometry(2, 2);
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    function resize() {
      var w = window.innerWidth;
      var h = window.innerHeight;
      renderer.setSize(w, h);
      material.uniforms.uResolution.value.set(w, h);
    }
    resize();
    window.addEventListener("resize", resize);

    var lastFrame = 0;
    function animate(time: number) {
      frameRef.current = requestAnimationFrame(animate);

      // Skip if tab hidden
      if (document.hidden) return;

      // Throttle to ~20fps when idle, full rate when running
      var status = statusRef.current;
      var interval = status === "running" ? 0 : 50;
      if (time - lastFrame < interval) return;
      lastFrame = time;

      var targetIntensity = status === "running" ? 0.10 : status === "completed" ? 0.04 : 0.06;
      var current = material.uniforms.uIntensity.value;
      material.uniforms.uIntensity.value += (targetIntensity - current) * 0.02;

      material.uniforms.uTime.value += status === "running" ? 0.8 : 0.2;
      renderer.render(scene, camera);
    }
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
