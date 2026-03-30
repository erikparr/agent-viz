"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { DitherRendererHandle } from "@/components/sandbox/DitherRenderer";

const DitherRenderer = dynamic(
  () =>
    import("@/components/sandbox/DitherRenderer").then(
      (mod) => mod.DitherRenderer
    ),
  { ssr: false }
);

const PALETTES = [
  { name: "Terminal", bg: "#0a0e14", a: "#0a2a30", b: "#4a9ead" },
  { name: "Amber", bg: "#1a0a00", a: "#3a2000", b: "#ffaa00" },
  { name: "Phosphor", bg: "#001a00", a: "#003a00", b: "#33ff33" },
  { name: "Bone", bg: "#1a1a18", a: "#3a3a35", b: "#e8e4d9" },
  { name: "Cobalt", bg: "#020818", a: "#0a1838", b: "#4466ff" },
  { name: "White", bg: "#0a0e14", a: "#2a2e34", b: "#e8e8e8" },
];

export default function DitherSandboxPage() {
  var rendererRef = useRef<DitherRendererHandle>(null);
  var [activePalette, setActivePalette] = useState(0);

  function selectPalette(index: number) {
    setActivePalette(index);
    var p = PALETTES[index];
    rendererRef.current?.setColors(p.bg, p.a, p.b);
  }

  return (
    <div className="w-screen h-screen bg-[#0a0e14] relative">
      <DitherRenderer ref={rendererRef} />

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {PALETTES.map((palette, i) => (
          <button
            key={palette.name}
            onClick={() => selectPalette(i)}
            className={`text-[10px] px-3 py-1.5 border transition-colors font-mono ${
              activePalette === i
                ? "border-white/40 text-white bg-white/10"
                : "border-white/15 text-white/50 hover:border-white/30 hover:text-white/80"
            }`}
          >
            {palette.name}
          </button>
        ))}
      </div>
    </div>
  );
}
