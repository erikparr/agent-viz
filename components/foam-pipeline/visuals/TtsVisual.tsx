import { PANGRAM, VISUAL_H, VISUAL_W } from "./shared";

export function TtsVisual() {
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
        className="flex items-center justify-between px-2.5 py-1.5"
        style={{ borderBottom: "1px solid var(--color-hairline)" }}
      >
        <span className="font-mono text-[8.5px] uppercase tracking-[0.22em] text-(--color-text-mute)">
          Input · foam-studio
        </span>
        <span className="size-1 rounded-full bg-(--color-accent) animate-[blink_1.2s_steps(1,end)_infinite]" />
      </div>

      <div className="flex-1 px-2.5 py-2 flex items-start">
        <span className="text-[12.5px] leading-[1.45] text-(--color-text) font-normal">
          {PANGRAM}
          <span
            className="inline-block align-[-2px] ml-[1px] animate-[blink_1s_steps(1,end)_infinite]"
            style={{
              width: 1,
              height: 14,
              background: "var(--color-accent)",
            }}
          />
        </span>
      </div>

      <div
        className="flex items-center justify-between px-2.5 py-1.5 bg-(--color-surface)/40"
        style={{ borderTop: "1px solid var(--color-hairline)" }}
      >
        <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-(--color-text-mute)">
          voice
        </span>
        <span className="font-mono text-[9px] text-(--color-text-dim)">
          eleven_multilingual_v2
        </span>
      </div>
    </div>
  );
}
