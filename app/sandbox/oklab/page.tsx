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

// Catmull-Rom interpolation between P1 and P2, using P0 and P3 for tangent continuity
function catmullRomOklab(
  p0: OklabColor, p1: OklabColor, p2: OklabColor, p3: OklabColor, t: number
): OklabColor {
  var t2 = t * t;
  var t3 = t2 * t;
  return {
    L: 0.5 * ((2 * p1.L) + (-p0.L + p2.L) * t + (2 * p0.L - 5 * p1.L + 4 * p2.L - p3.L) * t2 + (-p0.L + 3 * p1.L - 3 * p2.L + p3.L) * t3),
    a: 0.5 * ((2 * p1.a) + (-p0.a + p2.a) * t + (2 * p0.a - 5 * p1.a + 4 * p2.a - p3.a) * t2 + (-p0.a + 3 * p1.a - 3 * p2.a + p3.a) * t3),
    b: 0.5 * ((2 * p1.b) + (-p0.b + p2.b) * t + (2 * p0.b - 5 * p1.b + 4 * p2.b - p3.b) * t2 + (-p0.b + 3 * p1.b - 3 * p2.b + p3.b) * t3),
  };
}

// Get Catmull-Rom control points with endpoint duplication
function getSplinePoints(waypoints: OklabColor[], segIdx: number) {
  var last = waypoints.length - 1;
  var p0 = waypoints[Math.max(segIdx - 1, 0)];
  var p1 = waypoints[segIdx];
  var p2 = waypoints[Math.min(segIdx + 1, last)];
  var p3 = waypoints[Math.min(segIdx + 2, last)];
  return { p0, p1, p2, p3 };
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
  var speedCanvasRef = useRef<HTMLCanvasElement>(null);
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

        // Speed variation — breathe faster and slower along the path
        var speedMod = 1.0 + 0.15 * Math.sin(dt * 7.3) + 0.1 * Math.sin(dt * 3.1);
        var t = Math.min(dt * speedMod / WANDER_DURATION, 1.0);

        var segments = p.waypoints.length - 1;
        var segPos = t * segments;
        var segIdx = Math.min(Math.floor(segPos), segments - 1);
        var segT = segPos - segIdx;

        if (p.mode === "oklab") {
          // Catmull-Rom spline through OKLab waypoints
          var sp = getSplinePoints(p.waypoints, segIdx);
          var interp = catmullRomOklab(sp.p0, sp.p1, sp.p2, sp.p3, segT);
          cur.L = interp.L;
          cur.a = interp.a;
          cur.b = interp.b;
        } else {
          // RGB Catmull-Rom — convert to RGB, spline, convert back
          var sp = getSplinePoints(p.waypoints, segIdx);
          var rgbPoints = [sp.p0, sp.p1, sp.p2, sp.p3].map((c) => oklabToSrgb(c.L, c.a, c.b));
          var t2 = segT * segT;
          var t3 = t2 * segT;
          var rr = 0.5 * ((2 * rgbPoints[1].r) + (-rgbPoints[0].r + rgbPoints[2].r) * segT + (2 * rgbPoints[0].r - 5 * rgbPoints[1].r + 4 * rgbPoints[2].r - rgbPoints[3].r) * t2 + (-rgbPoints[0].r + 3 * rgbPoints[1].r - 3 * rgbPoints[2].r + rgbPoints[3].r) * t3);
          var gg = 0.5 * ((2 * rgbPoints[1].g) + (-rgbPoints[0].g + rgbPoints[2].g) * segT + (2 * rgbPoints[0].g - 5 * rgbPoints[1].g + 4 * rgbPoints[2].g - rgbPoints[3].g) * t2 + (-rgbPoints[0].g + 3 * rgbPoints[1].g - 3 * rgbPoints[2].g + rgbPoints[3].g) * t3);
          var bb = 0.5 * ((2 * rgbPoints[1].b) + (-rgbPoints[0].b + rgbPoints[2].b) * segT + (2 * rgbPoints[0].b - 5 * rgbPoints[1].b + 4 * rgbPoints[2].b - rgbPoints[3].b) * t2 + (-rgbPoints[0].b + 3 * rgbPoints[1].b - 3 * rgbPoints[2].b + rgbPoints[3].b) * t3);
          var clamped = `#${Math.round(Math.max(0, Math.min(1, rr)) * 255).toString(16).padStart(2, "0")}${Math.round(Math.max(0, Math.min(1, gg)) * 255).toString(16).padStart(2, "0")}${Math.round(Math.max(0, Math.min(1, bb)) * 255).toString(16).padStart(2, "0")}`;
          var okResult = hexToOklab(clamped);
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

      // --- Speed curve visualization ---
      var speedCanvas = speedCanvasRef.current;
      if (speedCanvas) {
        var sctx = speedCanvas.getContext("2d");
        if (sctx) {
          var sw = speedCanvas.width;
          var sh = speedCanvas.height;
          sctx.clearRect(0, 0, sw, sh);

          // Background
          sctx.fillStyle = "rgba(10, 14, 20, 0.8)";
          sctx.fillRect(0, 0, sw, sh);

          // Baseline (speed = 1.0)
          var baseY = sh * 0.5;
          sctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
          sctx.lineWidth = 1;
          sctx.beginPath();
          sctx.moveTo(0, baseY);
          sctx.lineTo(sw, baseY);
          sctx.stroke();

          // Labels
          sctx.fillStyle = "rgba(255, 255, 255, 0.3)";
          sctx.font = "9px monospace";
          sctx.fillText("speed", 4, 12);
          sctx.fillText("1.0", sw - 22, baseY - 4);
          sctx.fillText("0s", 4, sh - 4);
          sctx.fillText("3s", sw - 16, sh - 4);

          // Draw speed curve
          sctx.strokeStyle = "#00D177";
          sctx.lineWidth = 1.5;
          sctx.beginPath();
          var yScale = sh * 0.35;
          for (var sx = 0; sx < sw; sx++) {
            var st = (sx / sw) * WANDER_DURATION;
            var speed = 1.0 + 0.15 * Math.sin(st * 7.3) + 0.1 * Math.sin(st * 3.1);
            var sy = baseY - (speed - 1.0) * yScale / 0.25;
            if (sx === 0) sctx.moveTo(sx, sy);
            else sctx.lineTo(sx, sy);
          }
          sctx.stroke();

          // Draw effective t curve (accumulated progress)
          sctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
          sctx.lineWidth = 1;
          sctx.beginPath();
          for (var sx = 0; sx < sw; sx++) {
            var st = (sx / sw) * WANDER_DURATION;
            var speedMod = 1.0 + 0.15 * Math.sin(st * 7.3) + 0.1 * Math.sin(st * 3.1);
            var tVal = Math.min(st * speedMod / WANDER_DURATION, 1.0);
            var sy = sh - 8 - tVal * (sh - 20);
            if (sx === 0) sctx.moveTo(sx, sy);
            else sctx.lineTo(sx, sy);
          }
          sctx.stroke();
          sctx.fillStyle = "rgba(255, 255, 255, 0.15)";
          sctx.fillText("progress", sw - 52, 12);

          // Playhead
          var p3 = phaseRef.current;
          if (p3.phase === "wandering" && p3.startTime > 0) {
            var playDt = now - p3.startTime;
            var playX = Math.min(playDt / WANDER_DURATION, 1.0) * sw;

            sctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
            sctx.lineWidth = 1;
            sctx.beginPath();
            sctx.moveTo(playX, 0);
            sctx.lineTo(playX, sh);
            sctx.stroke();

            // Dot on the speed curve at playhead
            var playSpeed = 1.0 + 0.15 * Math.sin(playDt * 7.3) + 0.1 * Math.sin(playDt * 3.1);
            var playY = baseY - (playSpeed - 1.0) * yScale / 0.25;
            sctx.beginPath();
            sctx.arc(playX, playY, 4, 0, Math.PI * 2);
            sctx.fillStyle = "#00D177";
            sctx.fill();
          }
        }
      }
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

      <canvas
        ref={speedCanvasRef}
        width={CANVAS_SIZE}
        height={80}
        className="border border-white/10"
      />

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
