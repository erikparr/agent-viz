"use client";

import { CrosshatchBackground } from "@/components/CrosshatchBackground";
import { TerminalChrome } from "@/components/TerminalChrome";
import { QueryInput } from "@/components/QueryInput";
import { AgentFlow } from "@/components/AgentFlow";
import { useAgentStream } from "@/hooks/useAgentStream";

export default function Home() {
  var { run, startRun, reset } = useAgentStream();

  var statusClass = run?.status === "running"
    ? "text-step-code"
    : run?.status === "completed"
    ? "text-step-final"
    : run?.status === "error"
    ? "text-step-error"
    : "text-text-secondary";

  return (
    <>
      <CrosshatchBackground agentStatus={run?.status ?? "idle"} />

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 space-y-6">
        <TerminalChrome title="agent-viz v0.1.0">
          <QueryInput
            onSubmit={startRun}
            disabled={run?.status === "running"}
          />
        </TerminalChrome>

        {run && (
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
                    className="text-text-secondary hover:text-border-accent transition-colors"
                  >
                    [reset]
                  </button>
                )}
              </div>

              <AgentFlow run={run} />
            </div>
          </TerminalChrome>
        )}
      </main>
    </>
  );
}
