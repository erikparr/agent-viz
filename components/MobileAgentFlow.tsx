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
  var [flipped, setFlipped] = useState(false);
  var [direction, setDirection] = useState(0);
  var prevStepCount = useRef(run.steps.length);

  // Auto-advance to newest step when new steps arrive
  useEffect(() => {
    if (run.steps.length > prevStepCount.current) {
      setDirection(1);
      setCurrentIndex(run.steps.length - 1);
      setFlipped(false);
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

  function navigate(newIndex: number) {
    setDirection(newIndex > currentIndex ? 1 : -1);
    setCurrentIndex(newIndex);
    setFlipped(false);
  }

  function handleDragEnd(_: any, info: { offset: { x: number; y: number } }) {
    var swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold && currentIndex < steps.length - 1) {
      navigate(currentIndex + 1);
    } else if (info.offset.x > swipeThreshold && currentIndex > 0) {
      navigate(currentIndex - 1);
    }
  }

  var slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <div className="space-y-3">
      {/* Carousel container */}
      <div className="relative overflow-hidden">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="touch-pan-y"
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`${currentIndex}-${flipped}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={() => setFlipped(!flipped)}
            >
              {flipped ? (
                <StepDetail
                  step={steps[currentIndex]}
                  onClose={() => setFlipped(false)}
                />
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
            onClick={() => navigate(i)}
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
          {flipped ? "(tap to flip back)" : "(tap for detail)"}
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
