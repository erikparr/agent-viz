"use client";

import { useState } from "react";
import { FlowNode } from "./FlowNode";
import { StepDetail } from "./StepDetail";
import { MobileAgentFlow } from "./MobileAgentFlow";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { AgentRun } from "@/lib/types";

interface AgentFlowProps {
  run: AgentRun;
}

export function AgentFlow({ run }: AgentFlowProps) {
  var [selectedStep, setSelectedStep] = useState<number | null>(null);
  var selected = selectedStep !== null ? run.steps[selectedStep] : null;
  var isMobile = useMediaQuery("(max-width: 1023px)");

  if (isMobile === true) {
    return <MobileAgentFlow run={run} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        {run.steps.map((step, i) => (
          <FlowNode
            key={i}
            step={step}
            index={i}
            isActive={selectedStep === i}
            onClick={() => setSelectedStep(selectedStep === i ? null : i)}
          />
        ))}

        {run.status === "running" && (
          <div className="flex items-center gap-2 text-xs text-border-accent pl-8">
            <span className="inline-block w-[6px] h-[12px] bg-border-accent cursor-blink" />
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
