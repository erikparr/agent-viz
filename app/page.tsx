"use client";

import { CrosshatchBackground } from "@/components/CrosshatchBackground";
import { TerminalChrome } from "@/components/TerminalChrome";
import { QueryInput } from "@/components/QueryInput";
import { AgentFlow } from "@/components/AgentFlow";
import { useAgentStream } from "@/hooks/useAgentStream";

export default function Home() {
  var { run, startRun, reset } = useAgentStream();

  return (
    <>
      <CrosshatchBackground agentStatus={run?.status ?? "idle"} />

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Header + Query combined */}
        <TerminalChrome title="agent-viz v0.1.0">
          <QueryInput
            onSubmit={startRun}
            disabled={run?.status === "running"}
          />
        </TerminalChrome>

        {/* Agent Flow Visualization */}
        {run && (
          <TerminalChrome title={`Run: ${run.query.slice(0, 50)}`}>
            <div className="space-y-3">
              {/* Status line */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--color-text-secondary)]">
                  status:{" "}
                  <span
                    className={
                      run.status === "running"
                        ? "text-[var(--color-step-code)]"
                        : run.status === "completed"
                        ? "text-[var(--color-step-final)]"
                        : run.status === "error"
                        ? "text-[var(--color-step-error)]"
                        : "text-[var(--color-text-secondary)]"
                    }
                  >
                    {run.status}
                  </span>
                  {" | "}steps: {run.steps.length}
                </span>
                {run.status !== "running" && (
                  <button
                    onClick={reset}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
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
