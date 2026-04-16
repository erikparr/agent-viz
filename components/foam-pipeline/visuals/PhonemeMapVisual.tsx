import { PANGRAM_PHONEMES, VISUAL_H, VISUAL_W } from "./shared";

const PHONE_DURATION: Record<string, number> = {
  B: 0.35, D: 0.35, G: 0.35, K: 0.4, P: 0.4, T: 0.4,
  DH: 0.55, F: 0.55, S: 0.6, SH: 0.6, TH: 0.55, V: 0.55, Z: 0.6, ZH: 0.6,
  JH: 0.55, CH: 0.55,
  M: 0.5, N: 0.5, NG: 0.5,
  L: 0.55, R: 0.55, W: 0.5, Y: 0.5,
  AA: 0.95, AE: 0.9, AH: 0.75, AO: 0.95, AW: 1.0, AY: 1.0,
  EH: 0.85, ER: 0.85, EY: 0.95, IH: 0.75, IY: 0.9,
  OW: 0.95, OY: 1.0, UH: 0.8, UW: 0.95,
};

export function PhonemeMapVisual() {
  const flat: { phone: string; wordIdx: number }[] = [];
  PANGRAM_PHONEMES.forEach((w, wi) => {
    w.phones.forEach((p) => flat.push({ phone: p, wordIdx: wi }));
  });
  const shown = flat.slice(0, 14);

  const chipW = 14;
  const chipGap = 2;
  const totalW = shown.length * chipW + (shown.length - 1) * chipGap;

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
          Phonemes · ARPAbet
        </span>
        <span className="font-mono text-[8.5px] text-(--color-text-mute)">
          {flat.length} total
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center gap-1.5 px-2.5">
        <div
          className="flex items-center"
          style={{ gap: chipGap, width: totalW, maxWidth: "100%" }}
        >
          {shown.map((p, i) => (
            <div
              key={i}
              className="flex items-center justify-center rounded-[1.5px] bg-(--color-surface-2) font-mono text-(--color-text-dim)"
              style={{
                width: chipW,
                height: 15,
                fontSize: 8,
                letterSpacing: "0.04em",
                boxShadow: "inset 0 0 0 1px var(--color-hairline)",
              }}
              title={p.phone}
            >
              {p.phone}
            </div>
          ))}
        </div>

        <div
          className="flex items-end"
          style={{ gap: chipGap, width: totalW, maxWidth: "100%", height: 14 }}
        >
          {shown.map((p, i) => {
            const d = PHONE_DURATION[p.phone] ?? 0.5;
            return (
              <div
                key={i}
                style={{
                  width: chipW,
                  height: Math.round(d * 14),
                  background: "color-mix(in oklch, var(--color-text-dim) 45%, transparent)",
                }}
              />
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="font-mono text-[7.5px] uppercase tracking-[0.18em] text-(--color-text-mute)">
            midi
          </span>
          <span className="font-mono text-[8px] text-(--color-text-dim) tabular-nums">
            C3 · C♯3 · D3 · D♯3 · E3 … A♯3
          </span>
        </div>
      </div>
    </div>
  );
}
