"use client";

import type { ReactNode } from "react";
import type { PipelineStage as Stage } from "./types";

export function PipelineStageCard({
  stage,
  visual,
}: {
  stage: Stage;
  visual?: ReactNode;
}) {
  return (
    <article
      className="relative w-full rounded-[4px] bg-(--color-surface) px-4 py-3"
      style={{
        boxShadow: stage.emphasize
          ? "inset 2px 0 0 0 var(--color-accent), inset 0 0 0 1px color-mix(in oklch, var(--color-accent) 22%, var(--color-hairline))"
          : "inset 1px 0 0 0 var(--color-hairline-strong), inset 0 0 0 1px var(--color-hairline)",
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 sm:gap-5 items-stretch">
        <div className="min-w-0 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4 mb-1.5">
            <div className="flex items-baseline gap-3 min-w-0">
              <span className="font-mono text-[10px] tabular-nums text-(--color-text-mute) tracking-[0.12em]">
                {stage.num}
              </span>
              <h3 className="text-[13px] uppercase tracking-[0.16em] text-(--color-text) font-medium">
                {stage.title}
              </h3>
            </div>
            <span className="shrink-0 text-[9.5px] uppercase tracking-[0.18em] text-(--color-text-mute)">
              {stage.stack}
            </span>
          </div>

          <div className="font-mono text-[10.5px] tabular-nums text-(--color-text-dim) tracking-[0.02em]">
            {stage.signature}
          </div>
        </div>

        {visual && (
          <div className="shrink-0 w-full max-w-full sm:w-auto sm:self-stretch flex items-center sm:pl-5">
            {visual}
          </div>
        )}
      </div>
    </article>
  );
}

export function StageConnector({ annotation }: { annotation?: string }) {
  return (
    <div className="relative w-full flex flex-col items-center py-1.5">
      <div
        className="w-px"
        style={{ height: 10, background: "var(--color-hairline-strong)" }}
      />
      {annotation && (
        <div
          className="my-1 px-2 py-0.5 rounded-[2px] bg-(--color-surface)"
          style={{ boxShadow: "inset 0 0 0 1px var(--color-hairline)" }}
        >
          <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-(--color-text-dim)">
            {annotation}
          </span>
        </div>
      )}
      <div
        className="w-px"
        style={{ height: 10, background: "var(--color-hairline-strong)" }}
      />
    </div>
  );
}
