"use client";

import { ReactNode } from "react";
import { useMeasuredText } from "@/hooks/useMeasuredText";

interface MeasuredTextProps {
  text: string;
  whiteSpace?: "normal" | "pre-wrap";
  className?: string;
  as?: "div" | "pre" | "p";
  children?: ReactNode;
}

// Reserves the final wrapped height of `text` before paint, eliminating
// layout shift while content streams in. Reads font/line-height from the
// element's own computed style.
export function MeasuredText({
  text,
  whiteSpace = "normal",
  className,
  as: Tag = "div",
  children,
}: MeasuredTextProps) {
  var { ref, height } = useMeasuredText(text, { whiteSpace });

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={height != null ? { minHeight: height } : undefined}
    >
      {children ?? text}
    </Tag>
  );
}
