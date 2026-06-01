"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface StepCardProps {
  index: number;
  label: string;
  /** Tailwind class for label + border color, e.g. "text-step-code" */
  textClass: string;
  /** Tailwind class for border color, e.g. "border-step-code" */
  borderClass: string;
  /** Tailwind class for tinted fill, e.g. "bg-step-code/8" */
  bgClass: string;
  /** Raw hex for the active drop-shadow glow */
  glowHex: string;
  isActive?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export function StepCard({
  index,
  label,
  textClass,
  borderClass,
  bgClass,
  glowHex,
  isActive,
  onClick,
  children,
}: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      role="button"
      tabIndex={0}
      className="cursor-pointer group focus-visible:outline-none"
    >
      <fieldset
        className={`relative border ${borderClass} ${bgClass} px-3 pt-1 pb-2 transition-[filter] duration-200 group-hover:brightness-125`}
        style={{ filter: isActive ? `drop-shadow(0 0 8px ${glowHex})` : "none" }}
      >
        <legend className={`px-1 text-xs leading-none ${textClass}`}>
          <span className="text-text-secondary font-normal">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="mx-1 text-border-muted">·</span>
          <span className="font-bold">{label}</span>
        </legend>
        {children}
      </fieldset>
    </motion.div>
  );
}
