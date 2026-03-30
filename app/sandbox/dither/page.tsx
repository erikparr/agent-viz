"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import type { DitherRendererHandle } from "@/components/sandbox/DitherRenderer";

const DitherRenderer = dynamic(
  () =>
    import("@/components/sandbox/DitherRenderer").then(
      (mod) => mod.DitherRenderer
    ),
  { ssr: false }
);

export default function DitherSandboxPage() {
  var rendererRef = useRef<DitherRendererHandle>(null);

  return (
    <div className="w-screen h-screen bg-[#0a0e14] relative">
      <DitherRenderer ref={rendererRef} />

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <button
          onClick={() => rendererRef.current?.flashColor()}
          className="text-[10px] px-3 py-1.5 border border-white/15 text-white/50 hover:border-white/30 hover:text-white/80 transition-colors font-mono"
        >
          Flash
        </button>
      </div>
    </div>
  );
}
