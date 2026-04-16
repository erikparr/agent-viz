import { VISUAL_H, VISUAL_W } from "./shared";

export function SynthesisVisual() {
  const padX = 8;
  const width = VISUAL_W - padX * 2;
  const waveTop = 26;
  const waveH = 52;
  const centerY = waveTop + waveH / 2;

  const voices = [
    { phase: 0.0, amp: 0.9, freqA: 80, freqB: 26 },
    { phase: 0.7, amp: 0.6, freqA: 120, freqB: 34 },
    { phase: 1.4, amp: 0.45, freqA: 160, freqB: 48 },
  ];

  return (
    <div
      className="relative rounded-[3px] bg-(--color-bg-deep) overflow-hidden"
      style={{
        width: VISUAL_W,
        height: VISUAL_H,
        boxShadow: "inset 0 0 0 1px var(--color-hairline)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-2.5 py-1.5"
        style={{ borderBottom: "1px solid var(--color-hairline)" }}
      >
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-(--color-text-mute)">
            adsr
          </span>
          <AdsrGlyph />
        </div>
        <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-(--color-text-mute)">
          synthesis · juce
        </span>
      </div>

      <svg
        className="absolute inset-0"
        width={VISUAL_W}
        height={VISUAL_H}
        viewBox={`0 0 ${VISUAL_W} ${VISUAL_H}`}
      >
        <line
          x1={padX}
          y1={centerY}
          x2={padX + width}
          y2={centerY}
          stroke="var(--color-hairline)"
          strokeWidth="1"
        />
        {voices.map((v, i) => (
          <path
            key={i}
            d={generateVoicePath(width, waveH, v)}
            transform={`translate(${padX}, ${centerY})`}
            fill="none"
            stroke={
              i === 0
                ? "var(--color-accent)"
                : i === 1
                  ? "color-mix(in oklch, var(--color-accent) 55%, var(--color-text-dim))"
                  : "var(--color-text-dim)"
            }
            strokeWidth="1"
            strokeLinecap="round"
            opacity={i === 0 ? 0.95 : i === 1 ? 0.7 : 0.5}
          />
        ))}
      </svg>

      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2.5 py-1"
        style={{ borderTop: "1px solid var(--color-hairline)" }}
      >
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-(--color-text-mute)">
            voices
          </span>
          <span className="font-mono text-[9px] tabular-nums text-(--color-text)">3</span>
          <span className="font-mono text-[8px] text-(--color-text-mute)">/ 16</span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.18em] text-(--color-accent)">
          <span>→ DAW BUS</span>
        </div>
      </div>
    </div>
  );
}

function generateVoicePath(
  width: number,
  height: number,
  v: { phase: number; amp: number; freqA: number; freqB: number },
): string {
  const SAMPLES = 180;
  const max = height / 2 - 3;
  const envelope = (t: number) => {
    if (t < 0.06) return t / 0.06;
    if (t < 0.22) return 1 - 0.35 * ((t - 0.06) / 0.16);
    if (t < 0.78) return 0.65;
    return 0.65 * (1 - (t - 0.78) / 0.22);
  };
  const pts: string[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    const x = t * width;
    const s =
      (Math.sin(t * v.freqA + v.phase) * 0.6 +
        Math.sin(t * v.freqB + v.phase * 1.3) * 0.35) *
      envelope(t) *
      v.amp *
      max;
    pts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${s.toFixed(2)}`);
  }
  return pts.join(" ");
}

function AdsrGlyph() {
  const bars = [10, 7, 5, 8];
  return (
    <div className="flex items-end gap-[1.5px] h-3">
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            width: 2,
            height: h,
            background:
              i === 0
                ? "var(--color-accent)"
                : "color-mix(in oklch, var(--color-accent) 55%, var(--color-text-mute))",
          }}
        />
      ))}
    </div>
  );
}
