"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  hexToOklab,
  oklabToHex,
  oklabToSrgb,
  oklabLerp,
  isInGamut,
  type OklabColor,
} from "@/lib/oklab";

const WANDER_PALETTE = [
  "#FF4900", "#EE0050", "#5F2DFF", "#75F000", "#00B4FF",
  "#FF00AA", "#FFD600", "#00FFC8", "#FF6B35", "#8B00FF",
  "#E8453C", "#2D9CDB", "#27AE60", "#F2994A", "#9B51E0",
  "#7A8B6E", "#A89078", "#6B7F99", "#9E8A7C", "#708078",
];

const DEFAULT_COLOR = "#00D177";
const WANDER_DURATION = 3.0;
const WANDER_STOPS = 5;

const AB_MIN = -0.4;
const AB_MAX = 0.4;
const CANVAS_SIZE = 500;

// Pre-compute palette positions in OKLab
var paletteOklab = WANDER_PALETTE.map((hex) => ({ hex, ...hexToOklab(hex) }));
var defaultOklab = hexToOklab(DEFAULT_COLOR);

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function pickWanderColors(current: OklabColor): OklabColor[] {
  var colors: OklabColor[] = [{ ...current }];
  var available = [...paletteOklab];
  for (var i = 0; i < WANDER_STOPS; i++) {
    var idx = Math.floor(Math.random() * available.length);
    var pick = available.splice(idx, 1)[0];
    colors.push({ L: pick.L, a: pick.a, b: pick.b });
  }
  return colors;
}

function abToCanvas(a: number, b: number): { x: number; y: number } {
  return {
    x: ((a - AB_MIN) / (AB_MAX - AB_MIN)) * CANVAS_SIZE,
    y: ((AB_MAX - b) / (AB_MAX - AB_MIN)) * CANVAS_SIZE,
  };
}

export default function OklabSandboxPage() {
  var gamutCanvasRef = useRef<HTMLCanvasElement>(null);
  var overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  var animRef = useRef<number>(0);
  var trailRef = useRef<{ x: number; y: number; hex: string }[]>([]);
  var phaseRef = useRef<{
    phase: "idle" | "wandering" | "returning";
    startTime: number;
    waypoints: OklabColor[];
    mode: "rgb" | "oklab";
  }>({ phase: "idle", startTime: 0, waypoints: [], mode: "oklab" });
  var currentColorRef = useRef<OklabColor>({ ...defaultOklab });
  var [currentHex, setCurrentHex] = useState(DEFAULT_COLOR);
  var [lightnessSlice, setLightnessSlice] = useState(defaultOklab.L);

  // Render gamut background
  useEffect(() => {
    var canvas = gamutCanvasRef.current;
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var imageData = ctx.createImageData(CANVAS_SIZE, CANVAS_SIZE);
    var data = imageData.data;

    for (var py = 0; py < CANVAS_SIZE; py++) {
      for (var px = 0; px < CANVAS_SIZE; px++) {
        var a = AB_MIN + (px / CANVAS_SIZE) * (AB_MAX - AB_MIN);
        var b = AB_MAX - (py / CANVAS_SIZE) * (AB_MAX - AB_MIN);
        var idx = (py * CANVAS_SIZE + px) * 4;

        if (isInGamut(lightnessSlice, a, b)) {
          var rgb = oklabToSrgb(lightnessSlice, a, b);
          data[idx] = Math.round(rgb.r * 255);
          data[idx + 1] = Math.round(rgb.g * 255);
          data[idx + 2] = Math.round(rgb.b * 255);
          data[idx + 3] = 255;
        } else {
          data[idx] = 18;
          data[idx + 1] = 20;
          data[idx + 2] = 26;
          data[idx + 3] = 255;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [lightnessSlice]);

  // Animation loop for overlay
  useEffect(() => {
    function animate() {
      animRef.current = requestAnimationFrame(animate);

      var canvas = overlayCanvasRef.current;
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      if (!ctx) return;

      var now = performance.now() / 1000;
      var p = phaseRef.current;
      var cur = currentColorRef.current;

      if (p.phase === "wandering") {
        if (p.startTime < 0) p.startTime = now;
        var dt = now - p.startTime;
        var t = Math.min(dt / WANDER_DURATION, 1.0);

        var segments = p.waypoints.length - 1;
        var segPos = t * segments;
        var segIdx = Math.min(Math.floor(segPos), segments - 1);
        var segT = smoothstep(segPos - segIdx);

        if (p.mode === "oklab") {
          var interp = oklabLerp(p.waypoints[segIdx], p.waypoints[segIdx + 1], segT);
          cur.L = interp.L;
          cur.a = interp.a;
          cur.b = interp.b;
        } else {
          // RGB interpolation — convert waypoints to RGB, lerp, convert back
          var c1 = p.waypoints[segIdx];
          var c2 = p.waypoints[segIdx + 1];
          var hex1 = oklabToHex(c1.L, c1.a, c1.b);
          var hex2 = oklabToHex(c2.L, c2.a, c2.b);
          var r1 = parseInt(hex1.slice(1, 3), 16) / 255;
          var g1 = parseInt(hex1.slice(3, 5), 16) / 255;
          var b1 = parseInt(hex1.slice(5, 7), 16) / 255;
          var r2 = parseInt(hex2.slice(1, 3), 16) / 255;
          var g2 = parseInt(hex2.slice(3, 5), 16) / 255;
          var b2 = parseInt(hex2.slice(5, 7), 16) / 255;
          var rr = r1 + (r2 - r1) * segT;
          var gg = g1 + (g2 - g1) * segT;
          var bb = b1 + (b2 - b1) * segT;
          var okResult = hexToOklab(
            `#${Math.round(rr * 255).toString(16).padStart(2, "0")}${Math.round(gg * 255).toString(16).padStart(2, "0")}${Math.round(bb * 255).toString(16).padStart(2, "0")}`
          );
          cur.L = okResult.L;
          cur.a = okResult.a;
          cur.b = okResult.b;
        }

        if (dt >= WANDER_DURATION) {
          p.phase = "returning";
          p.startTime = now;
        }
      } else if (p.phase === "returning") {
        if (p.startTime < 0) p.startTime = now;
        var dt = now - p.startTime;
        var interp = oklabLerp(cur, defaultOklab, 0.06);
        cur.L = interp.L;
        cur.a = interp.a;
        cur.b = interp.b;
        if (dt >= 1.0) {
          p.phase = "idle";
        }
      }

      // Update hex display
      var hex = oklabToHex(cur.L, cur.a, cur.b);
      setCurrentHex(hex);

      // Add to trail
      var pos = abToCanvas(cur.a, cur.b);
      trailRef.current.push({ x: pos.x, y: pos.y, hex });
      if (trailRef.current.length > 120) trailRef.current.shift();

      // Draw overlay
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Draw axis lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      var center = abToCanvas(0, 0);
      ctx.beginPath();
      ctx.moveTo(center.x, 0);
      ctx.lineTo(center.x, CANVAS_SIZE);
      ctx.moveTo(0, center.y);
      ctx.lineTo(CANVAS_SIZE, center.y);
      ctx.stroke();

      // Draw axis labels
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.font = "10px monospace";
      ctx.fillText("+a (red)", CANVAS_SIZE - 55, center.y - 6);
      ctx.fillText("-a (green)", 4, center.y - 6);
      ctx.fillText("+b (yellow)", center.x + 6, 14);
      ctx.fillText("-b (blue)", center.x + 6, CANVAS_SIZE - 6);

      // Draw trail
      if (trailRef.current.length > 1) {
        for (var i = 1; i < trailRef.current.length; i++) {
          var alpha = i / trailRef.current.length;
          var pt = trailRef.current[i];
          var prev = trailRef.current[i - 1];
          ctx.strokeStyle = pt.hex;
          ctx.globalAlpha = alpha * 0.8;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(pt.x, pt.y);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      // Draw palette dots
      for (var p2 of paletteOklab) {
        var dotPos = abToCanvas(p2.a, p2.b);
        ctx.beginPath();
        ctx.arc(dotPos.x, dotPos.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = p2.hex;
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw default color marker
      var defPos = abToCanvas(defaultOklab.a, defaultOklab.b);
      ctx.beginPath();
      ctx.arc(defPos.x, defPos.y, 8, 0, Math.PI * 2);
      ctx.strokeStyle = DEFAULT_COLOR;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(defPos.x, defPos.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = DEFAULT_COLOR;
      ctx.fill();

      // Draw current color dot
      var curPos = abToCanvas(cur.a, cur.b);
      ctx.beginPath();
      ctx.arc(curPos.x, curPos.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = hex;
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  var triggerWander = useCallback((mode: "rgb" | "oklab") => {
    trailRef.current = [];
    phaseRef.current = {
      phase: "wandering",
      startTime: -1,
      waypoints: pickWanderColors(currentColorRef.current),
      mode,
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-[#0a0e14] flex flex-col items-center justify-center gap-6 font-mono">
      <div className="text-white/50 text-xs">
        OKLab Color Space — a-b plane at L={lightnessSlice.toFixed(2)}
      </div>

      <div className="relative" style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>
        <canvas
          ref={gamutCanvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="absolute inset-0"
        />
        <canvas
          ref={overlayCanvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="absolute inset-0"
        />
      </div>

      <div className="flex items-center gap-4">
        <span className="text-white/40 text-[10px]">L</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={lightnessSlice}
          onChange={(e) => setLightnessSlice(parseFloat(e.target.value))}
          className="w-48 accent-white/50"
        />
        <span className="text-white/40 text-[10px] w-8">{lightnessSlice.toFixed(2)}</span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => triggerWander("rgb")}
          className="text-[10px] px-3 py-1.5 border border-white/15 text-white/50 hover:border-white/30 hover:text-white/80 transition-colors"
        >
          Wander RGB
        </button>
        <button
          onClick={() => triggerWander("oklab")}
          className="text-[10px] px-3 py-1.5 border border-white/15 text-white/50 hover:border-white/30 hover:text-white/80 transition-colors"
        >
          Wander OKLab
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 border border-white/20"
          style={{ backgroundColor: currentHex }}
        />
        <span className="text-white/60 text-xs">{currentHex.toUpperCase()}</span>
      </div>
    </div>
  );
}
