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
  { name: "Terminal", a: "#0a0e14", b: "#4a9ead" },
  { name: "Amber", a: "#1a0a00", b: "#ffaa00" },
  { name: "Phosphor", a: "#001a00", b: "#33ff33" },
  { name: "Infrared", a: "#0a0005", b: "#ff2255" },
  { name: "Bone", a: "#1a1a18", b: "#e8e4d9" },
  { name: "Cobalt", a: "#020818", b: "#4466ff" },
];

export default function DitherSandboxPage() {
  var rendererRef = useRef<DitherRendererHandle>(null);
  var [activePalette, setActivePalette] = useState(0);

  function selectPalette(index: number) {
    setActivePalette(index);
    rendererRef.current?.setColors(PALETTES[index].a, PALETTES[index].b);
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
