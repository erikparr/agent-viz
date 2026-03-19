"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TerminalChrome } from "./TerminalChrome";
import type { AgentStep } from "@/lib/types";

const STEP_COLORS: Record<AgentStep["type"], string> = {
  thinking: "var(--color-step-thinking)",
  code: "var(--color-step-code)",
  tool_call: "var(--color-step-tool)",
  tool_result: "var(--color-step-result)",
  final_answer: "var(--color-step-final)",
  error: "var(--color-step-error)",
};

interface StepDetailProps {
  step: AgentStep | null;
  onClose: () => void;
}

export function StepDetail({ step, onClose }: StepDetailProps) {
  return (
    <AnimatePresence>
      {step && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <TerminalChrome
            title={`Step ${step.stepNumber} Detail`}
            accentColor={STEP_COLORS[step.type]}
          >
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold uppercase" style={{ color: STEP_COLORS[step.type] }}>
                  {step.type.replace("_", " ")}
                </span>
                <button
                  onClick={onClose}
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  [close]
                </button>
              </div>

              {step.thought && (
                <div>
                  <div className="text-[var(--color-text-secondary)] mb-1">// reasoning</div>
                  <pre className="whitespace-pre-wrap text-[var(--color-text-primary)]">{step.thought}</pre>
                </div>
              )}

              {step.code && (
                <div>
                  <div className="text-[var(--color-step-code)] mb-1">// code</div>
                  <pre className="whitespace-pre-wrap text-[var(--color-text-primary)] bg-[var(--color-bg-primary)] p-2">
                    {step.code}
                  </pre>
                </div>
              )}

              {step.codeOutput && (
                <div>
                  <div className="text-[var(--color-text-secondary)] mb-1">// output</div>
                  <pre className="whitespace-pre-wrap text-[var(--color-step-result)]">{step.codeOutput}</pre>
                </div>
              )}

              {step.toolCall && (
                <div>
                  <div className="text-[var(--color-step-tool)] mb-1">// tool call</div>
                  <pre className="whitespace-pre-wrap text-[var(--color-text-primary)]">
                    {step.toolCall.name}({JSON.stringify(step.toolCall.arguments, null, 2)})
                  </pre>
                </div>
              )}

              {step.toolResult && (
                <div>
                  <div className="text-[var(--color-text-secondary)] mb-1">// result</div>
                  <pre className="whitespace-pre-wrap text-[var(--color-text-primary)]">{step.toolResult.output}</pre>
                </div>
              )}

              {step.finalAnswer && (
                <div>
                  <div className="text-[var(--color-step-final)] mb-1">// final answer</div>
                  <pre className="whitespace-pre-wrap text-[var(--color-text-primary)]">{step.finalAnswer}</pre>
                </div>
              )}
            </div>
          </TerminalChrome>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
