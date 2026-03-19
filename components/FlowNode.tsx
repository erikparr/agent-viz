"use client";

import { motion } from "framer-motion";
import type { AgentStep } from "@/lib/types";

const STEP_CONFIG: Record<AgentStep["type"], { color: string; label: string }> = {
  thinking: { color: "var(--color-step-thinking)", label: "THINK" },
  code: { color: "var(--color-step-code)", label: "CODE" },
  tool_call: { color: "var(--color-step-tool)", label: "TOOL" },
  tool_result: { color: "var(--color-step-result)", label: "RESULT" },
  final_answer: { color: "var(--color-step-final)", label: "ANSWER" },
  error: { color: "var(--color-step-error)", label: "ERROR" },
};

interface FlowNodeProps {
  step: AgentStep;
  isActive?: boolean;
  onClick?: () => void;
}

export function FlowNode({ step, isActive, onClick }: FlowNodeProps) {
  var config = STEP_CONFIG[step.type];

  // Build preview lines based on content type
  var lines: string[] = [];
  if (step.thought) {
    lines = step.thought.split("\n").slice(0, 3).map((l) => l.slice(0, 70));
  } else if (step.code) {
    lines = step.code.split("\n").slice(0, 4).map((l) => l.slice(0, 70));
  } else if (step.toolCall) {
    lines = [`${step.toolCall.name}()`, ...Object.entries(step.toolCall.arguments).map(([k, v]) => `  ${k}: ${JSON.stringify(v).slice(0, 50)}`)];
  } else if (step.toolResult) {
    lines = step.toolResult.output.split("\n").slice(0, 3).map((l) => l.slice(0, 70));
  } else if (step.finalAnswer) {
    lines = step.finalAnswer.split("\n").slice(0, 4).map((l) => l.slice(0, 70));
  }
  if (lines.length === 0) lines = ["..."];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{
        opacity: 1,
        scale: isActive ? 1.02 : 1,
        y: 0,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <div
        className="relative"
        style={{ minWidth: step.type === "tool_call" ? 140 : 200 }}
      >
        {/* Top border with label */}
        <div className="flex items-center text-xs leading-none" style={{ color: config.color }}>
          <span>╭── </span>
          <span className="font-bold">{config.label}</span>
          <span className="flex-1 overflow-hidden whitespace-nowrap">
            {" "}{"─".repeat(80)}
          </span>
          <span>╮</span>
        </div>

        {/* Content lines */}
        {lines.map((line, i) => (
          <div key={i} className="flex text-xs leading-snug">
            <span style={{ color: config.color }}>│</span>
            <div className="flex-1 px-2 min-w-0">
              <span
                className="block truncate"
                style={{
                  color:
                    step.type === "code"
                      ? "var(--color-step-code)"
                      : "var(--color-text-secondary)",
                }}
              >
                {line}
              </span>
            </div>
            <span style={{ color: config.color }}>│</span>
          </div>
        ))}

        {/* Bottom border */}
        <div className="flex items-center text-xs leading-none" style={{ color: config.color }}>
          <span>╰</span>
          <span className="flex-1 overflow-hidden whitespace-nowrap">
            {"─".repeat(80)}
          </span>
          <span>╯</span>
        </div>
      </div>
    </motion.div>
  );
}
