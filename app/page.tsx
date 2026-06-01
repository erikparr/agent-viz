"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { animate, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import type { DitherRendererHandle } from "@/components/sandbox/DitherRenderer";
import { CrosshatchBackground } from "@/components/CrosshatchBackground";
import { TerminalChrome } from "@/components/ui/TerminalChrome";
import { Button } from "@/components/ui/Button";
import { QueryInput } from "@/components/QueryInput";
import { AgentFlow } from "@/components/AgentFlow";
import { SidePanel } from "@/components/SidePanel";
import { ProjectModal } from "@/components/ProjectModal";
import { ContactModal } from "@/components/ContactModal";
import { useAgentStream } from "@/hooks/useAgentStream";
import type { Project } from "@/lib/portfolioData";

const DitherRenderer = dynamic(
  () =>
    import("@/components/sandbox/DitherRenderer").then(
      (mod) => mod.DitherRenderer
    ),
  { ssr: false }
);



export default function Home() {
  var { run, startRun, reset } = useAgentStream();
  var [selectedProject, setSelectedProject] = useState<Project | null>(null);
  var [contactOpen, setContactOpen] = useState(false);
  var ditherRef = useRef<DitherRendererHandle>(null);
  var queryColRef = useRef<HTMLDivElement>(null);
  var [queryHeight, setQueryHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!queryColRef.current) return;
    var ro = new ResizeObserver((entries) => {
      var h = entries[0]?.contentRect.height;
      if (h) setQueryHeight(h);
    });
    ro.observe(queryColRef.current);
    return () => ro.disconnect();
  }, []);

  var handleSubmit = useCallback((query: string, isPreset?: boolean) => {
    ditherRef.current?.flashColor();
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

  var sideRef = useRef<HTMLDivElement>(null);
  var scrollFired = useRef(false);
  var reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!hasSideContent) {
      scrollFired.current = false;
      return;
    }
    if (scrollFired.current || !sideRef.current) return;
    scrollFired.current = true;

    var targetY = sideRef.current.getBoundingClientRect().top + window.scrollY;
    if (reduceMotion) {
      window.scrollTo(0, targetY);
      return;
    }
    var controls = animate(window.scrollY, targetY, {
      duration: 0.7,
      ease: [0.22, 0.61, 0.36, 1],
      onUpdate: (v) => window.scrollTo(0, v),
    });
    return () => controls.stop();
  }, [hasSideContent, reduceMotion]);

  return (
    <>
      <CrosshatchBackground agentStatus={run?.status ?? "idle"} />

      <div className={`relative z-10 flex flex-col min-h-screen max-w-7xl mx-auto px-4 pt-14 pb-4 transition-[filter] duration-200 ${modalOpen ? "blur-sm" : ""}`}>
        {/* Header — sticky so the query stays reachable while scrolling portfolio */}
        <div className="sticky top-0 z-20 shrink-0 pb-4 bg-bg-primary/85 backdrop-blur-sm">
          <TerminalChrome title="erik parr — portfolio agent">
            <div className="flex gap-4 items-stretch">
              <div ref={queryColRef} className="flex-1 min-w-0">
                <QueryInput
                  onSubmit={handleSubmit}
                  onContact={() => setContactOpen(true)}
                  disabled={run?.status === "running"}
                />
              </div>
              {queryHeight !== null && (
                <div
                  className="hidden lg:block shrink-0 border border-border-muted"
                  style={{ width: queryHeight, height: queryHeight }}
                >
                  <DitherRenderer ref={ditherRef} />
                </div>
              )}
            </div>
          </TerminalChrome>
        </div>

        {/* Content — stacked full-width sections; page scrolls naturally */}
        {run && (
          <div className="flex flex-col gap-6">
            {/* RUN section */}
            <div className="w-full">
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
                      <Button variant="ghost" size="sm" onClick={reset}>
                        [reset]
                      </Button>
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

            {/* Portfolio section — appears below; auto-scrolls into view on first reveal */}
            {hasSideContent && (
              <div ref={sideRef} className="w-full">
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

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </>
  );
}
