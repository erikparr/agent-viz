"use client";

import { motion } from "framer-motion";
import { useTypewriterLines } from "@/hooks/useTypewriter";
import { STEP_THEME } from "@/lib/theme";
import type { AgentStep } from "@/lib/types";

function stripMarkdown(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");
}

function getLines(step: AgentStep): string[] {
  var lines: string[] = [];
  if (step.thought) {
    lines = step.thought.split("\n").slice(0, 2).map((l) => l.slice(0, 80));
  } else if (step.code) {
    lines = step.code.split("\n").slice(0, 3).map((l) => l.slice(0, 80));
  } else if (step.toolCall) {
    lines = [`${step.toolCall.name}(${JSON.stringify(step.toolCall.arguments).slice(0, 60)})`];
  } else if (step.toolResult) {
    lines = [stripMarkdown(step.toolResult.output).slice(0, 80)];
  } else if (step.finalAnswer) {
    lines = stripMarkdown(step.finalAnswer).split("\n").slice(0, 3).map((l) => l.slice(0, 80));
  }
  if (lines.length === 0) lines = ["..."];
  return lines;
}

interface FlowNodeProps {
  step: AgentStep;
  index: number;
  isActive?: boolean;
  onClick?: () => void;
}

export function FlowNode({ step, index, isActive, onClick }: FlowNodeProps) {
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
      initial={{ opacity: 0, x: -8 }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick?.(); } }}
      role="button"
      tabIndex={0}
      className="cursor-pointer group focus-visible:outline-none"
    >
      <div
        className="relative max-w-2xl transition-[filter] duration-200"
        style={{
          filter: isActive ? `drop-shadow(0 0 8px ${theme.hex})` : "none",
        }}
      >
        {/* Top border with step number and label */}
        <div className={`flex items-center text-xs leading-none ${theme.text}`}>
          <span>╭── </span>
          <span className="text-text-secondary font-normal">{String(index + 1).padStart(2, "0")}</span>
          <span className="mx-1 text-border-muted">·</span>
          <span className="font-bold">{theme.label}</span>
          <span className="flex-1 overflow-hidden whitespace-nowrap">
            {" "}{"─".repeat(120)}
          </span>
          <span>╮</span>
        </div>

        {/* Content lines with tinted background */}
        <div className={`${theme.bg} group-hover:brightness-150 transition-[filter] duration-150`}>
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
            {"─".repeat(120)}
          </span>
          <span>╯</span>
        </div>
      </div>
    </motion.div>
  );
}
