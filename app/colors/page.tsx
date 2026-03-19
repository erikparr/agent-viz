"use client";

import { useState } from "react";

const PALETTES = {
  "Cool Indigo": {
    description: "Deep indigo chrome, electric blue accents, violet highlights",
    border_accent: "#6366f1",    // indigo-500
    border_muted: "#4b5563",     // gray-600
    bg_primary: "#0a0a12",       // near-black with blue tint
    bg_surface: "#12121e",       // dark blue-black
    text_primary: "#e2e8f0",     // slate-200
    text_secondary: "#94a3b8",   // slate-400
    steps: {
      thinking: "#818cf8",       // indigo-400
      code: "#34d399",           // emerald-400
      tool: "#60a5fa",           // blue-400
      result: "#c084fc",         // purple-400
      final: "#a78bfa",          // violet-400
      error: "#f87171",          // red-400
    },
  },
  "Midnight Violet": {
    description: "Violet chrome, cool cyan data colors, warm amber final answers",
    border_accent: "#8b5cf6",    // violet-500
    border_muted: "#525266",     // muted violet-gray
    bg_primary: "#0c0a14",       // deep violet-black
    bg_surface: "#15121f",       // dark violet surface
    text_primary: "#e4e0ed",     // light violet-white
    text_secondary: "#9892a6",   // muted lavender
    steps: {
      thinking: "#7dd3fc",       // sky-300
      code: "#4ade80",           // green-400
      tool: "#38bdf8",           // sky-400
      result: "#c084fc",         // purple-400
      final: "#fbbf24",          // amber-400
      error: "#fb7185",          // rose-400
    },
  },
  "Electric Blue": {
    description: "Bright blue chrome, neon accents, cyberpunk energy",
    border_accent: "#3b82f6",    // blue-500
    border_muted: "#475569",     // slate-600
    bg_primary: "#080c14",       // very dark blue
    bg_surface: "#0f1525",       // dark navy
    text_primary: "#e2e8f0",     // slate-200
    text_secondary: "#8898b0",   // muted blue-gray
    steps: {
      thinking: "#60a5fa",       // blue-400
      code: "#4ade80",           // green-400
      tool: "#22d3ee",           // cyan-400
      result: "#a78bfa",         // violet-400
      final: "#fbbf24",          // amber-400
      error: "#f87171",          // red-400
    },
  },
  "Frost": {
    description: "Ice-cool palette, subtle and refined, minimal chrome",
    border_accent: "#7dd3fc",    // sky-300
    border_muted: "#4a5568",     // gray-600
    bg_primary: "#0b0f14",       // cool dark
    bg_surface: "#111820",       // dark steel
    text_primary: "#d6e4f0",     // cool white
    text_secondary: "#7e96ab",   // steel blue
    steps: {
      thinking: "#7dd3fc",       // sky-300
      code: "#6ee7b7",           // emerald-300
      tool: "#93c5fd",           // blue-300
      result: "#d8b4fe",         // purple-300
      final: "#fcd34d",          // amber-300
      error: "#fca5a5",          // red-300
    },
  },
  "Neon Noir": {
    description: "High contrast, saturated neons on pure black",
    border_accent: "#a855f7",    // purple-500
    border_muted: "#3f3f52",     // dark muted
    bg_primary: "#050508",       // near pure black
    bg_surface: "#0e0e16",       // barely lifted
    text_primary: "#f0eef5",     // warm white
    text_secondary: "#8b85a0",   // muted purple-gray
    steps: {
      thinking: "#818cf8",       // indigo-400
      code: "#22c55e",           // green-500
      tool: "#06b6d4",           // cyan-500
      result: "#d946ef",         // fuchsia-500
      final: "#eab308",          // yellow-500
      error: "#ef4444",          // red-500
    },
  },
};

type PaletteKey = keyof typeof PALETTES;

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-8 rounded-sm border border-white/10"
        style={{ background: color }}
      />
      <div>
        <div className="text-xs font-bold" style={{ color }}>{label}</div>
        <div className="text-[10px] opacity-60">{color}</div>
      </div>
    </div>
  );
}

function PalettePreview({ name, palette }: { name: string; palette: typeof PALETTES[PaletteKey] }) {
  return (
    <div
      className="p-4 space-y-4"
      style={{ background: palette.bg_primary }}
    >
      {/* Mini terminal chrome */}
      <div style={{ color: palette.border_accent }} className="text-sm">
        <div>╭── {name} ──{"─".repeat(40)}╮</div>
        <div className="flex">
          <span>│</span>
          <div className="flex-1 px-3 py-2" style={{ background: palette.bg_surface }}>
            <div className="text-xs mb-1" style={{ color: palette.text_primary }}>
              {palette.description}
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span style={{ color: palette.border_accent }}>&gt;</span>
              <span style={{ color: palette.text_secondary }}>Enter a research query...</span>
            </div>
          </div>
          <span>│</span>
        </div>
        <div>╰{"─".repeat(50)}╯</div>
      </div>

      {/* Step nodes preview */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(palette.steps).map(([type, color]) => (
          <div key={type}>
            <div className="text-[10px] leading-none" style={{ color }}>
              ╭── {type.toUpperCase()} ──╮
            </div>
            <div className="flex text-[10px]" style={{ background: `${color}11` }}>
              <span style={{ color }}>│</span>
              <span className="px-2" style={{ color: palette.text_secondary }}>sample text...</span>
              <span style={{ color }}>│</span>
            </div>
            <div className="text-[10px] leading-none" style={{ color }}>
              ╰──────────────╯
            </div>
          </div>
        ))}
      </div>

      {/* Swatches */}
      <div className="grid grid-cols-3 gap-3">
        <Swatch color={palette.border_accent} label="Chrome" />
        <Swatch color={palette.border_muted} label="Muted" />
        <Swatch color={palette.text_primary} label="Text" />
        <Swatch color={palette.text_secondary} label="Secondary" />
        <Swatch color={palette.bg_surface} label="Surface" />
        <Swatch color={palette.bg_primary} label="Background" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {Object.entries(palette.steps).map(([type, color]) => (
          <Swatch key={type} color={color} label={type} />
        ))}
      </div>
    </div>
  );
}

export default function ColorsPage() {
  var [selected, setSelected] = useState<PaletteKey | null>(null);

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6">
      <h1 className="text-xl font-bold mb-1 font-mono">Color Palette Explorer</h1>
      <p className="text-sm text-gray-400 font-mono mb-6">Click a palette to see it full-size. All are blue/violet direction.</p>

      <div className="space-y-6">
        {Object.entries(PALETTES).map(([name, palette]) => (
          <div
            key={name}
            onClick={() => setSelected(selected === name ? null : name as PaletteKey)}
            className="cursor-pointer border rounded-sm transition-all"
            style={{
              borderColor: selected === name ? palette.border_accent : "#333",
              boxShadow: selected === name ? `0 0 20px ${palette.border_accent}33` : "none",
            }}
          >
            <PalettePreview name={name} palette={palette} />
          </div>
        ))}
      </div>
    </div>
  );
}
