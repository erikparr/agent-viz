"use client";

import { useTypewriterLines } from "@/hooks/useTypewriter";
import { STEP_THEME } from "@/lib/theme";
import { StepCard } from "@/components/ui/StepCard";
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
    <StepCard
      index={index}
      label={theme.label}
      textClass={theme.text}
      borderClass={theme.border}
      bgClass={theme.bg}
      glowHex={theme.hex}
      isActive={isActive}
      onClick={onClick}
    >
      {renderedLines.map((line, i) => (
        <div key={i} className="text-xs leading-snug min-w-0">
          <span className={`block truncate ${contentTextClass}`}>
            {line}
            {!done && i === (displayedLines.length - 1) && (
              <span className="inline-block w-[6px] h-[12px] align-middle bg-border-accent cursor-blink ml-px" />
            )}
          </span>
        </div>
      ))}
    </StepCard>
  );
}
