import type { AgentStep } from "./types";

interface StepStyle {
  text: string;
  border: string;
  bg: string;
  hex: string;
  label: string;
}

export const STEP_THEME: Record<AgentStep["type"], StepStyle> = {
  thinking: {
    text: "text-step-thinking",
    border: "border-step-thinking",
    bg: "bg-step-thinking/8",
    hex: "#b0bec9",
    label: "THINK",
  },
  code: {
    text: "text-step-code",
    border: "border-step-code",
    bg: "bg-step-code/6",
    hex: "#4ade80",
    label: "CODE",
  },
  tool_call: {
    text: "text-step-tool",
    border: "border-step-tool",
    bg: "bg-step-tool/6",
    hex: "#2d5ff5",
    label: "TOOL",
  },
  tool_result: {
    text: "text-step-result",
    border: "border-step-result",
    bg: "bg-step-result/5",
    hex: "#e2e8f0",
    label: "RESULT",
  },
  final_answer: {
    text: "text-step-final",
    border: "border-step-final",
    bg: "bg-step-final/5",
    hex: "#f8fafc",
    label: "ANSWER",
  },
  error: {
    text: "text-step-error",
    border: "border-step-error",
    bg: "bg-step-error/8",
    hex: "#f87171",
    label: "ERROR",
  },
};
