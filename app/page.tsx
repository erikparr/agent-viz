"use client";

import { useState } from "react";
import { CrosshatchBackground } from "@/components/CrosshatchBackground";
import { TerminalChrome } from "@/components/TerminalChrome";
import { QueryInput } from "@/components/QueryInput";
import { AgentFlow } from "@/components/AgentFlow";
import { ProjectPanel } from "@/components/ProjectPanel";
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

  var hasProjects = run?.steps.some((s) => s.projectRefs && s.projectRefs.length > 0);
  var modalOpen = selectedProject !== null;

  return (
    <>
      <CrosshatchBackground agentStatus={run?.status ?? "idle"} />

      <main className={`relative z-10 max-w-7xl mx-auto px-4 py-8 space-y-6 transition-[filter] duration-200 ${modalOpen ? "blur-sm" : ""}`}>
        <TerminalChrome title="erik parr — portfolio agent">
          <QueryInput
            onSubmit={startRun}
            disabled={run?.status === "running"}
          />
        </TerminalChrome>

        {run && (
          <div className={`flex gap-6 ${hasProjects ? "flex-col lg:flex-row" : ""}`}>
            <div className={hasProjects ? "lg:w-3/5 min-w-0" : "w-full"}>
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

            {hasProjects && (
              <div className="lg:w-2/5 min-w-0">
                <ProjectPanel run={run} onSelectProject={setSelectedProject} />
              </div>
            )}
          </div>
        )}
      </main>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
