"use client";

import { motion } from "framer-motion";
import { useTypewriterLines } from "@/hooks/useTypewriter";
import { STEP_THEME } from "@/lib/theme";
import type { AgentStep } from "@/lib/types";

function getLines(step: AgentStep): string[] {
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
  return lines;
}

interface FlowNodeProps {
  step: AgentStep;
  isActive?: boolean;
  onClick?: () => void;
}

export function FlowNode({ step, isActive, onClick }: FlowNodeProps) {
  var theme = STEP_THEME[step.type];
  var lines = getLines(step);
  var { displayedLines, done } = useTypewriterLines(lines, 6);

  var contentTextClass = step.type === "code"
    ? "text-step-code"
    : step.type === "final_answer"
    ? "text-step-final"
    : "text-text-secondary";

  var renderedLines = lines.map((_, i) => displayedLines[i] || "");

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
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick?.(); } }}
      role="button"
      tabIndex={0}
      className="cursor-pointer group focus-visible:outline-none"
    >
      <div
        className="relative"
        style={{
          minWidth: step.type === "tool_call" ? 140 : 200,
          filter: isActive ? `drop-shadow(0 0 8px ${theme.hex})` : "none",
          transition: "filter 0.2s ease",
        }}
      >
        {/* Top border with label */}
        <div className={`flex items-center text-xs leading-none ${theme.text}`}>
          <span>╭── </span>
          <span className="font-bold">{theme.label}</span>
          <span className="flex-1 overflow-hidden whitespace-nowrap">
            {" "}{"─".repeat(80)}
          </span>
          <span>╮</span>
        </div>

        {/* Content lines with tinted background */}
        <div className={theme.bg}>
          {renderedLines.map((line, i) => (
            <div key={i} className="flex text-xs leading-snug">
              <span className={theme.text}>│</span>
              <div className="flex-1 px-2 min-w-0">
                <span className={`block truncate ${contentTextClass}`}>
                  {line}
                  {!done && i === (displayedLines.length - 1) && (
                    <span className="inline-block w-[6px] h-[12px] align-middle bg-border-accent cursor-blink ml-px" />
                  )}
                </span>
              </div>
              <span className={theme.text}>│</span>
            </div>
          ))}
        </div>

        {/* Bottom border */}
        <div className={`flex items-center text-xs leading-none ${theme.text}`}>
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
