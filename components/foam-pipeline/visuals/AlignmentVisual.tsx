import { PANGRAM_PHONEMES, VISUAL_H, VISUAL_W } from "./shared";

export function AlignmentVisual() {
  const words = PANGRAM_PHONEMES.slice(0, 5);

  const wordSpans = [0.8, 1.0, 1.1, 0.9, 1.2];
  const total = wordSpans.reduce((a, b) => a + b, 0);
  const cumulative: number[] = [];
  {
    let acc = 0;
    for (const span of wordSpans) {
      cumulative.push(acc);
      acc += span;
    }
    cumulative.push(total);
  }

  const padX = 8;
  const width = VISUAL_W - padX * 2;
  const labelsY = 16;
  const tickTop = 22;
  const waveTop = 34;
  const waveH = 34;
  const axisY = VISUAL_H - 14;

  const wavePath = generateWavePath(width, waveH, wordSpans);

  const boundaries = cumulative.map((c) => padX + (c / total) * width);

  return (
    <div
      className="relative rounded-[3px] bg-(--color-bg-deep) overflow-hidden"
      style={{
        width: VISUAL_W,
        height: VISUAL_H,
        boxShadow: "inset 0 0 0 1px var(--color-hairline)",
      }}
    >
      <div className="absolute top-1.5 left-2.5 font-mono text-[8.5px] uppercase tracking-[0.22em] text-(--color-text-mute)">
        Alignment · MFA
      </div>

      <svg
        className="absolute inset-0"
        width={VISUAL_W}
        height={VISUAL_H}
        viewBox={`0 0 ${VISUAL_W} ${VISUAL_H}`}
      >
        {words.map((w, i) => {
          const cx = padX + ((cumulative[i] + wordSpans[i] / 2) / total) * width;
          return (
            <text
              key={w.word + i}
              x={cx}
              y={labelsY + 14}
              textAnchor="middle"
              fontFamily="Geist Mono, ui-monospace, monospace"
              fontSize="9"
              fill="var(--color-text-dim)"
            >
              {w.word}
            </text>
          );
        })}

        {boundaries.map((x, i) => (
          <line
            key={i}
            x1={x}
            y1={tickTop + 12}
            x2={x}
            y2={waveTop + waveH}
            stroke="var(--color-hairline-strong)"
            strokeWidth="1"
          />
        ))}

        <rect
          x={padX}
          y={waveTop}
          width={width}
          height={waveH}
          fill="color-mix(in oklch, var(--color-surface-2) 100%, transparent)"
          stroke="var(--color-hairline)"
          strokeWidth="1"
        />

        <g transform={`translate(${padX}, ${waveTop + waveH / 2})`}>
          <path
            d={wavePath}
            fill="none"
            stroke="var(--color-text-dim)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        <line
          x1={padX}
          x2={padX + width}
          y1={axisY}
          y2={axisY}
          stroke="var(--color-hairline)"
          strokeWidth="1"
        />
        {[0, 0.5, 1.0, 1.5, 2.0].map((s) => {
          const x = padX + (s / 2.0) * width;
          return (
            <g key={s}>
              <line
                x1={x}
                y1={axisY}
                x2={x}
                y2={axisY + 2}
                stroke="var(--color-hairline-strong)"
                strokeWidth="1"
              />
              <text
                x={x}
                y={axisY + 10}
                textAnchor={s === 0 ? "start" : s === 2 ? "end" : "middle"}
                fontFamily="Geist Mono, ui-monospace, monospace"
                fontSize="7.5"
                fill="var(--color-text-mute)"
              >
                {s.toFixed(1)}s
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function generateWavePath(
  width: number,
  height: number,
  wordSpans: number[],
): string {
  let seed = 7777;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const totalSpan = wordSpans.reduce((a, b) => a + b, 0);
  const SAMPLES = 200;
  const amp = height / 2 - 2;

  const wordBoundaries: number[] = [0];
  {
    let acc = 0;
    for (const s of wordSpans) {
      acc += s / totalSpan;
      wordBoundaries.push(acc);
    }
  }

  const envelopeAt = (t: number): number => {
    for (let i = 0; i < wordBoundaries.length - 1; i++) {
      const a = wordBoundaries[i];
      const b = wordBoundaries[i + 1];
      if (t >= a && t < b) {
        const local = (t - a) / (b - a);
        if (local < 0.08 || local > 0.92) return 0.15 + rand() * 0.05;
        return 0.4 + Math.sin(((local - 0.08) * Math.PI) / 0.84) * 0.55;
      }
    }
    return 0.15;
  };

  const points: string[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    const x = t * width;
    const hi = Math.sin(t * 420 + rand() * 0.5);
    const mid = Math.sin(t * 120 + 1.3);
    const noise = (rand() - 0.5) * 0.6;
    const sample = (hi * 0.5 + mid * 0.3 + noise * 0.2) * envelopeAt(t) * amp;
    points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${sample.toFixed(2)}`);
  }
  return points.join(" ");
}
