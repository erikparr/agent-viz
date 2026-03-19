"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TerminalChrome } from "./TerminalChrome";
import { STEP_THEME } from "@/lib/theme";
import type { AgentStep } from "@/lib/types";

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
            colorClass={STEP_THEME[step.type].text}
          >
            <div className={`space-y-3 text-xs ${STEP_THEME[step.type].bg}`}>
              <div className="flex justify-between items-center">
                <span className={`font-bold uppercase ${STEP_THEME[step.type].text}`}>
                  {step.type.replace("_", " ")}
                </span>
                <button
                  onClick={onClose}
                  className="text-text-secondary hover:text-text-primary"
                >
                  [close]
                </button>
              </div>

              {step.thought && (
                <div>
                  <div className={`mb-1 opacity-70 ${STEP_THEME[step.type].text}`}>// reasoning</div>
                  <pre className="whitespace-pre-wrap text-text-primary">{step.thought}</pre>
                </div>
              )}

              {step.code && (
                <div>
                  <div className="text-step-code mb-1">// code</div>
                  <pre className="whitespace-pre-wrap p-2 border-l-2 border-step-code bg-step-code/5 text-step-code">
                    {step.code}
                  </pre>
                </div>
              )}

              {step.codeOutput && (
                <div>
                  <div className="mb-1 opacity-70 text-step-result">// output</div>
                  <pre className="whitespace-pre-wrap p-2 border-l-2 border-step-result bg-step-result/5 text-step-result">
                    {step.codeOutput}
                  </pre>
                </div>
              )}

              {step.toolCall && (
                <div>
                  <div className="text-step-tool mb-1">// tool call</div>
                  <pre className="whitespace-pre-wrap p-2 border-l-2 border-step-tool bg-step-tool/5 text-text-primary">
                    <span className="text-step-tool">{step.toolCall.name}</span>({JSON.stringify(step.toolCall.arguments, null, 2)})
                  </pre>
                </div>
              )}

              {step.toolResult && (
                <div>
                  <div className="mb-1 opacity-70 text-step-result">// result</div>
                  <pre className="whitespace-pre-wrap text-text-primary">{step.toolResult.output}</pre>
                </div>
              )}

              {step.finalAnswer && (
                <div>
                  <div className="text-step-final mb-1">// final answer</div>
                  <pre className="whitespace-pre-wrap p-2 border-l-2 border-step-final bg-step-final/5 text-step-final">
                    {step.finalAnswer}
                  </pre>
                </div>
              )}
            </div>
          </TerminalChrome>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
