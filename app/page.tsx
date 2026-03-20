"use client";

import { useState } from "react";
import { CrosshatchBackground } from "@/components/CrosshatchBackground";
import { TerminalChrome } from "@/components/TerminalChrome";
import { QueryInput } from "@/components/QueryInput";
import { AgentFlow } from "@/components/AgentFlow";
import { SidePanel } from "@/components/SidePanel";
import { ProjectModal } from "@/components/ProjectModal";
import { useAgentStream } from "@/hooks/useAgentStream";
import type { Project } from "@/lib/portfolioData";

export default function Home() {
  var { run, startRun, reset } = useAgentStream();
  var [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

      <div className={`relative z-10 flex flex-col h-screen max-w-7xl mx-auto px-4 py-4 transition-[filter] duration-200 ${modalOpen ? "blur-sm" : ""}`}>
        {/* Header — fixed height */}
        <div className="shrink-0 pb-4">
          <TerminalChrome title="erik parr — portfolio agent">
            <QueryInput
              onSubmit={startRun}
              disabled={run?.status === "running"}
            />
          </TerminalChrome>
        </div>

        {/* Content — fills remaining viewport */}
        {run && (
          <div className={`flex gap-6 min-h-0 flex-1 ${hasSideContent ? "flex-col lg:flex-row" : ""}`}>
            {/* Left column — agent flow */}
            <div className={`${hasSideContent ? "lg:w-3/5" : "w-full"} min-h-0 overflow-y-auto scrollbar-terminal`}>
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
              <div className="lg:w-2/5 min-h-0 overflow-y-auto scrollbar-terminal">
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
