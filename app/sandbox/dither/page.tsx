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

const CUBE_COLORS = [
  { name: "Terminal", color: "#4a9ead" },
  { name: "Amber", color: "#ffaa00" },
  { name: "Phosphor", color: "#33ff33" },
  { name: "Infrared", color: "#ff2255" },
  { name: "Bone", color: "#e8e4d9" },
  { name: "Cobalt", color: "#4466ff" },
];

export default function DitherSandboxPage() {
  var rendererRef = useRef<DitherRendererHandle>(null);
  var [activePalette, setActivePalette] = useState(0);

  function selectPalette(index: number) {
    setActivePalette(index);
    rendererRef.current?.setCubeColor(CUBE_COLORS[index].color);
  }

  return (
    <div className="w-screen h-screen bg-[#0a0e14] relative">
      <DitherRenderer ref={rendererRef} />

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {CUBE_COLORS.map((entry, i) => (
          <button
            key={entry.name}
            onClick={() => selectPalette(i)}
            className={`text-[10px] px-3 py-1.5 border transition-colors font-mono ${
              activePalette === i
                ? "border-white/40 text-white bg-white/10"
                : "border-white/15 text-white/50 hover:border-white/30 hover:text-white/80"
            }`}
          >
            {entry.name}
          </button>
        ))}
      </div>
    </div>
  );
}
