"use client";

import { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import type { DitherRendererHandle } from "@/components/sandbox/DitherRenderer";
import { CrosshatchBackground } from "@/components/CrosshatchBackground";
import { TerminalChrome } from "@/components/TerminalChrome";
import { QueryInput } from "@/components/QueryInput";
import { AgentFlow } from "@/components/AgentFlow";
import { SidePanel } from "@/components/SidePanel";
import { ProjectModal } from "@/components/ProjectModal";
import { useAgentStream } from "@/hooks/useAgentStream";
import type { Project } from "@/lib/portfolioData";

const DitherRenderer = dynamic(
  () =>
    import("@/components/sandbox/DitherRenderer").then(
      (mod) => mod.DitherRenderer
    ),
  { ssr: false }
);

const DITHER_PALETTES = [
  { bg: "#0a0e14", a: "#0a2a30", b: "#4a9ead" },
  { bg: "#1a0a00", a: "#3a2000", b: "#ffaa00" },
  { bg: "#001a00", a: "#003a00", b: "#33ff33" },
  { bg: "#0a0e14", a: "#2a2e34", b: "#e8e8e8" },
  { bg: "#1a1a18", a: "#3a3a35", b: "#e8e4d9" },
  { bg: "#020818", a: "#0a1838", b: "#4466ff" },
];

export default function Home() {
  var { run, startRun, reset } = useAgentStream();
  var [selectedProject, setSelectedProject] = useState<Project | null>(null);
  var ditherRef = useRef<DitherRendererHandle>(null);
  var paletteIndex = useRef(0);

  var handleSubmit = useCallback((query: string, isPreset?: boolean) => {
    paletteIndex.current = (paletteIndex.current + 1) % DITHER_PALETTES.length;
    var palette = DITHER_PALETTES[paletteIndex.current];
    ditherRef.current?.setColors(palette.bg, palette.a, palette.b);
    startRun(query, isPreset);
  }, [startRun]);

  var statusClass = run?.status === "running"
    ? "text-step-code"
    : run?.status === "completed"
    ? "text-step-final"
    : run?.status === "error"
    ? "text-step-error"
    : "text-text-secondary";

  var hasSideContent = run?.steps.some(
    (s) => (s.projectRefs && s.projectRefs.length > 0) || (s.contentRefs && s.contentRefs.length > 0)
  );
  var modalOpen = selectedProject !== null;

  return (
    <>
      <CrosshatchBackground agentStatus={run?.status ?? "idle"} />

      <div className={`relative z-10 flex flex-col min-h-screen lg:h-screen max-w-7xl mx-auto px-4 py-4 transition-[filter] duration-200 ${modalOpen ? "blur-sm" : ""}`}>
        {/* Header — fixed height */}
        <div className="shrink-0 pb-4">
          <TerminalChrome title="erik parr — portfolio agent">
            <div className="flex gap-4">
              <div className="flex-1 min-w-0">
                <QueryInput
                  onSubmit={handleSubmit}
                  disabled={run?.status === "running"}
                />
              </div>
              <div className="hidden lg:block w-28 h-28 shrink-0 border border-border-muted">
                <DitherRenderer ref={ditherRef} />
              </div>
            </div>
          </TerminalChrome>
        </div>

        {/* Content — fills remaining viewport */}
        {run && (
          <div className={`flex gap-6 lg:min-h-0 flex-1 ${hasSideContent ? "flex-col lg:flex-row" : ""}`}>
            {/* Left column — agent flow */}
            <div className={`${hasSideContent ? "lg:w-3/5" : "w-full"} min-w-0 lg:min-h-0 lg:overflow-y-auto scrollbar-terminal`}>
              <TerminalChrome title={`Run: ${run.query.slice(0, 50)}`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary">
                      status:{" "}
                      <span className={statusClass}>
                        {run.status === "running" ? "● running" : run.status === "completed" ? "● completed" : run.status}
                      </span>
                      <span className="text-border-muted"> | </span>
                      steps: <span className="text-text-primary">{run.steps.length}</span>
                    </span>
                    {run.status !== "running" && (
                      <button
                        onClick={reset}
                        className="text-text-secondary hover:text-border-accent focus-visible:ring-2 focus-visible:ring-border-accent focus-visible:outline-none transition-colors"
                      >
                        [reset]
                      </button>
                    )}
                  </div>

                  <AgentFlow run={run} />

                  {run.status === "error" && (
                    <div className="text-xs text-step-error p-2 border border-step-error/20 bg-step-error/5">
                      error: {run.error || "Connection failed"}
                    </div>
                  )}
                </div>
              </TerminalChrome>
            </div>

            {/* Right column — side panel */}
            {hasSideContent && (
              <div className="lg:w-2/5 lg:min-h-0 lg:overflow-y-auto scrollbar-terminal">
                <SidePanel run={run} onSelectProject={setSelectedProject} />
              </div>
            )}
          </div>
        )}
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
