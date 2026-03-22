"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlowNode } from "./FlowNode";
import { StepDetail } from "./StepDetail";
import { STEP_THEME } from "@/lib/theme";
import type { AgentRun } from "@/lib/types";

interface MobileAgentFlowProps {
  run: AgentRun;
}

export function MobileAgentFlow({ run }: MobileAgentFlowProps) {
  var [currentIndex, setCurrentIndex] = useState(0);
  var [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  var prevStepCount = useRef(run.steps.length);

  // Auto-advance to newest step when new steps arrive
  useEffect(() => {
    if (run.steps.length > prevStepCount.current) {
      setCurrentIndex(run.steps.length - 1);
      setFlippedIndex(null);
    }
    prevStepCount.current = run.steps.length;
  }, [run.steps.length]);

  // Clamp index if steps shrink
  useEffect(() => {
    if (run.steps.length > 0 && currentIndex >= run.steps.length) {
      setCurrentIndex(run.steps.length - 1);
    }
  }, [run.steps.length, currentIndex]);

  var steps = run.steps;
  if (steps.length === 0) return null;

  var isFlipped = flippedIndex === currentIndex;

  function handleDragEnd(_: any, info: { offset: { x: number; y: number } }) {
    var swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold && currentIndex < steps.length - 1) {
      setFlippedIndex(null);
      setCurrentIndex(currentIndex + 1);
    } else if (info.offset.x > swipeThreshold && currentIndex > 0) {
      setFlippedIndex(null);
      setCurrentIndex(currentIndex - 1);
    }
  }

  function handleTap() {
    setFlippedIndex(flippedIndex === currentIndex ? null : currentIndex);
  }

  return (
    <div className="space-y-3">
      {/* Carousel container */}
      <div
        className="relative overflow-hidden"
        style={{ perspective: "1000px" }}
      >
        <motion.div
          key={currentIndex}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          onTap={handleTap}
          className="touch-pan-y"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentIndex}-${isFlipped ? "back" : "front"}`}
              initial={{ rotateY: isFlipped ? -90 : 90 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: isFlipped ? 90 : -90 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {isFlipped ? (
                <div className="min-h-[120px]">
                  <StepDetail
                    step={steps[currentIndex]}
                    onClose={() => setFlippedIndex(null)}
                  />
                </div>
              ) : (
                <FlowNode
                  step={steps[currentIndex]}
                  index={currentIndex}
                  isActive={false}
                  onClick={() => {}}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 py-2">
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrentIndex(i);
              setFlippedIndex(null);
            }}
            aria-label={`Go to step ${i + 1}`}
            className="p-1 focus-visible:ring-2 focus-visible:ring-border-accent focus-visible:outline-none"
          >
            <div
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === currentIndex ? "scale-125" : "opacity-50"
              }`}
              style={{ backgroundColor: STEP_THEME[step.type].hex }}
            />
          </button>
        ))}
      </div>

      {/* Step counter */}
      <div className="text-center text-xs text-text-secondary">
        {currentIndex + 1} / {steps.length}
        <span className="text-border-muted mx-2">&middot;</span>
        <span className={STEP_THEME[steps[currentIndex].type].text}>
          {STEP_THEME[steps[currentIndex].type].label}
        </span>
        <span className="text-border-muted ml-2">
          {isFlipped ? "(tap to flip back)" : "(tap for detail)"}
        </span>
      </div>

      {/* Running indicator */}
      {run.status === "running" && (
        <div className="flex justify-center">
          <span className="inline-block w-[6px] h-[12px] bg-border-accent cursor-blink" />
        </div>
      )}
    </div>
  );
}
