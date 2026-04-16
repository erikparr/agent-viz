import { VISUAL_H, VISUAL_W } from "./shared";

const FILTERS = ["vowels", "stops", "fricatives"] as const;
const GRID_ROWS = [
  ["AH", "IH", "AW", "EH", "ER", "AE"],
  ["DH", "K", "B", "F", "S", "T"],
] as const;
const ACTIVE_FILTER = "vowels";
const TRIGGERED = { row: 1, col: 1 };

export function SamplerUiVisual() {
  return (
    <div
      className="relative rounded-[3px] bg-(--color-bg-deep) overflow-hidden flex flex-col"
      style={{
        width: VISUAL_W,
        height: VISUAL_H,
        boxShadow: "inset 0 0 0 1px var(--color-hairline)",
      }}
    >
      <div
        className="flex items-center gap-1.5 px-2.5 py-1.5"
        style={{ borderBottom: "1px solid var(--color-hairline)" }}
      >
        <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-(--color-text-mute) mr-1">
          filter
        </span>
        {FILTERS.map((f) => {
          const active = f === ACTIVE_FILTER;
          return (
            <span
              key={f}
              className="px-1.5 py-0.5 rounded-[2px] font-mono text-[8.5px]"
              style={{
                background: active
                  ? "color-mix(in oklch, var(--color-accent) 18%, transparent)"
                  : "transparent",
                color: active ? "var(--color-accent)" : "var(--color-text-mute)",
                boxShadow: active
                  ? "inset 0 0 0 1px color-mix(in oklch, var(--color-accent) 45%, transparent)"
                  : "inset 0 0 0 1px var(--color-hairline)",
              }}
            >
              {f}
            </span>
          );
        })}
      </div>

      <div className="flex-1 px-2.5 py-1.5 flex flex-col justify-center gap-1">
        {GRID_ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1">
            {row.map((cell, ci) => {
              const triggered = ri === TRIGGERED.row && ci === TRIGGERED.col;
              return (
                <div
                  key={ci}
                  className="flex-1 flex items-center justify-center rounded-[1.5px] font-mono"
                  style={{
                    fontSize: 9,
                    padding: "2px 0",
                    background: triggered
                      ? "var(--color-accent)"
                      : "var(--color-surface-2)",
                    color: triggered ? "var(--color-bg-deep)" : "var(--color-text-dim)",
                    boxShadow: triggered
                      ? `0 0 0 1px var(--color-accent), 0 0 10px color-mix(in oklch, var(--color-accent) 45%, transparent)`
                      : "inset 0 0 0 1px var(--color-hairline)",
                    fontWeight: triggered ? 600 : 400,
                  }}
                >
                  {cell}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div
        className="flex items-center justify-between px-2.5 py-1"
        style={{ borderTop: "1px solid var(--color-hairline)" }}
      >
        <div className="flex items-center gap-1.5">
          <span className="size-1 rounded-full bg-(--color-accent)" />
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-(--color-text-mute)">
            midi in · ch 1
          </span>
        </div>
        <span className="font-mono text-[8px] text-(--color-text-mute) tabular-nums">
          D3 · vel 92
        </span>
      </div>
    </div>
  );
}
