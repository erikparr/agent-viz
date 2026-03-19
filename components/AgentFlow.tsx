"use client";

import { useState } from "react";
import { FlowNode } from "./FlowNode";
import { StepDetail } from "./StepDetail";
import { STEP_THEME } from "@/lib/theme";
import type { AgentRun } from "@/lib/types";

interface AgentFlowProps {
  run: AgentRun;
}

export function AgentFlow({ run }: AgentFlowProps) {
  var [selectedStep, setSelectedStep] = useState<number | null>(null);
  var selected = selectedStep !== null ? run.steps[selectedStep] : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start gap-x-1 gap-y-3">
        {run.steps.map((step, i) => (
          <div key={i} className="flex items-center gap-1">
            <FlowNode
              step={step}
              isActive={selectedStep === i}
              onClick={() => setSelectedStep(selectedStep === i ? null : i)}
            />
            {i < run.steps.length - 1 && (
              <span className={`text-xs whitespace-nowrap select-none ${STEP_THEME[step.type].text}`}>
                →
              </span>
            )}
          </div>
        ))}

        {run.status === "running" && (
          <div className="flex items-center gap-1 text-xs text-border-accent self-center">
            <span>→</span>
            <span className="cursor-blink">_</span>
          </div>
        )}
      </div>

      <StepDetail
        step={selected}
        onClose={() => setSelectedStep(null)}
      />
    </div>
  );
}
