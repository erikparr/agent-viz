# FOAM Pipeline in Project Modal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 5-stage visual pipeline (TTS → Alignment → Phoneme Map → Sampler UI → Synthesis) to the FOAM project modal in `agent-viz`, ported from `/Users/erikparr/_sketches/portfolio-presentation` and condensed to fit the modal footprint.

**Architecture:** New `components/foam-pipeline/` directory containing the orchestrator, one stage-card component, shared data/types, and 5 visual-aid components. Token isolation via a scoped `.foam-pipeline { ... }` block in `app/globals.css` that maps the source's design-system variables to `agent-viz`'s existing tokens. Integration is a single conditional branch inside `components/ProjectModal.tsx` (`project.id === "foam"`).

**Tech Stack:** Next.js 16, React 19, TypeScript 5.9, Tailwind CSS 4 (with arbitrary-custom-property syntax like `bg-(--color-bg-deep)`), framer-motion.

**Source reference:** `/Users/erikparr/_sketches/portfolio-presentation/src/` — the 5 visuals live under `components/foam-visuals/`, the card/connector lives in `components/PipelineStage.tsx`, the orchestrator in `views/FoamPipelineView.tsx`, and the data in `data/foam-pipeline.ts`.

**Design spec:** `docs/superpowers/specs/2026-04-16-foam-pipeline-in-modal-design.md`

**Testing:** No test framework is configured. Verification is:
1. `npx tsc --noEmit` passes after each file change.
2. `npm run dev` compiles without errors (turbopack shows HMR errors live).
3. In-browser smoke test after integration.

---

## Task 1: Add scoped CSS token bridge to globals.css

**Files:**
- Modify: `app/globals.css` (append at end)

- [ ] **Step 1: Append the `.foam-pipeline` token block**

Open `app/globals.css`. After the existing `.scrollbar-terminal { ... }` rule, append:

```css
/* FOAM pipeline — scoped token bridge mapping portfolio-presentation design
   system to agent-viz's existing palette. Visuals inherit these vars. */
.foam-pipeline {
  --color-surface: var(--color-bg-surface);
  --color-surface-2: var(--color-bg-elevated);
  --color-bg-deep: var(--color-bg-primary);
  --color-hairline: var(--color-border-muted);
  --color-hairline-strong: var(--color-border-accent);
  --color-text: var(--color-text-primary);
  --color-text-dim: var(--color-text-secondary);
  --color-text-mute: color-mix(in oklch, var(--color-text-secondary) 55%, transparent);
  --color-accent: var(--color-step-tool);
  --radius-panel: 4px;
  --radius-chip: 2px;
}
```

No new `@keyframes` are needed — the existing `blink` keyframe (already in this file) will substitute for the source's `hud-blink` in later tasks.

- [ ] **Step 2: Start dev server and confirm CSS compiles**

Run: `npm run dev`
Expected: compiles without errors; `http://localhost:3000` loads.

Leave the dev server running for subsequent tasks (HMR picks up every change).

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(foam): scope portfolio-presentation tokens for FOAM pipeline"
```

---

## Task 2: Create shared data, types, and visual constants

**Files:**
- Create: `components/foam-pipeline/types.ts`
- Create: `components/foam-pipeline/data.ts`
- Create: `components/foam-pipeline/visuals/shared.ts`

- [ ] **Step 1: Create `types.ts`**

Path: `components/foam-pipeline/types.ts`

```typescript
export type PipelineVisualKey =
  | "tts"
  | "alignment"
  | "phoneme-map"
  | "sampler-ui"
  | "synthesis";

export type PipelineStage = {
  num: string;
  title: string;
  signature: string;
  stack: string;
  visualKey: PipelineVisualKey;
  emphasize?: boolean;
};
```

(Note: the source type had a `body` field. It's intentionally dropped here per the design spec — the per-stage body is redundant with the modal's long-form description.)

- [ ] **Step 2: Create `data.ts`**

Path: `components/foam-pipeline/data.ts`

```typescript
import type { PipelineStage } from "./types";

export const FOAM_STAGES: PipelineStage[] = [
  {
    num: "01",
    title: "TTS Generation",
    signature: "text → speech waveform",
    stack: "React · FastAPI · ElevenLabs",
    visualKey: "tts",
  },
  {
    num: "02",
    title: "Forced Alignment · MFA",
    signature: "waveform + transcript → phoneme timings",
    stack: "Montreal Forced Aligner · ARPAbet",
    visualKey: "alignment",
  },
  {
    num: "03",
    title: "Phoneme Mapping",
    signature: "timings → indexed phoneme bundle",
    stack: "Python · G2P · t-SNE",
    visualKey: "phoneme-map",
  },
  {
    num: "04",
    title: "UI · Web + VST",
    signature: "bundle → filterable, triggerable",
    stack: "React · Zustand · JUCE 8",
    visualKey: "sampler-ui",
  },
  {
    num: "05",
    title: "Audio Synthesis",
    signature: "trigger → polyphonic playback",
    stack: "JUCE DSP · Polyphonic Voice Pool",
    visualKey: "synthesis",
    emphasize: true,
  },
];

export const CONNECTOR_ANNOTATIONS: Record<number, string> = {
  3: ".phonemebundle",
};
```

- [ ] **Step 3: Create `visuals/shared.ts`**

Path: `components/foam-pipeline/visuals/shared.ts`

Note the dimensions: **240 × 96** (condensed from source's 260 × 108 per the design spec).

```typescript
export const PANGRAM = "the quick brown fox jumps over the lazy dog";

export const PANGRAM_PHONEMES: { word: string; phones: string[] }[] = [
  { word: "the", phones: ["DH", "AH"] },
  { word: "quick", phones: ["K", "W", "IH", "K"] },
  { word: "brown", phones: ["B", "R", "AW", "N"] },
  { word: "fox", phones: ["F", "AA", "K", "S"] },
  { word: "jumps", phones: ["JH", "AH", "M", "P", "S"] },
  { word: "over", phones: ["OW", "V", "ER"] },
  { word: "the", phones: ["DH", "AH"] },
  { word: "lazy", phones: ["L", "EY", "Z", "IY"] },
  { word: "dog", phones: ["D", "AO", "G"] },
];

export const VISUAL_W = 240;
export const VISUAL_H = 96;
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/foam-pipeline/types.ts components/foam-pipeline/data.ts components/foam-pipeline/visuals/shared.ts
git commit -m "feat(foam): add pipeline data, types, and visual constants"
```

---

## Task 3: Port TtsVisual

**Files:**
- Create: `components/foam-pipeline/visuals/TtsVisual.tsx`
- Source: `/Users/erikparr/_sketches/portfolio-presentation/src/components/foam-visuals/TtsVisual.tsx`

**Porting notes:**
- Import `PANGRAM`, `VISUAL_H`, `VISUAL_W` from `./shared` (paths differ from source).
- Replace `hud-blink` animation name with `blink` (both animation keyframes appear twice in the source — the 1.2s blinking dot and the 1s blinking cursor).

- [ ] **Step 1: Create the file**

Path: `components/foam-pipeline/visuals/TtsVisual.tsx`

```typescript
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
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/foam-pipeline/visuals/TtsVisual.tsx
git commit -m "feat(foam): port TtsVisual"
```

---

## Task 4: Port AlignmentVisual

**Files:**
- Create: `components/foam-pipeline/visuals/AlignmentVisual.tsx`
- Source: `/Users/erikparr/_sketches/portfolio-presentation/src/components/foam-visuals/AlignmentVisual.tsx`

**Porting notes:**
- Import from `./shared`.
- The source uses hardcoded `labelsY = 16`, `tickTop = 22`, `waveTop = 34`, `waveH = 34`, `axisY = VISUAL_H - 14`. At `VISUAL_H = 96`, the axis sits at `y=82` with the waveform ending at `y=68` — fits fine. No geometry changes required.
- No `hud-blink` animation in this file.

- [ ] **Step 1: Create the file**

Path: `components/foam-pipeline/visuals/AlignmentVisual.tsx`

```typescript
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
```

- [ ] **Step 2: Type-check and commit**

```bash
npx tsc --noEmit
git add components/foam-pipeline/visuals/AlignmentVisual.tsx
git commit -m "feat(foam): port AlignmentVisual"
```

---

## Task 5: Port PhonemeMapVisual

**Files:**
- Create: `components/foam-pipeline/visuals/PhonemeMapVisual.tsx`
- Source: `/Users/erikparr/_sketches/portfolio-presentation/src/components/foam-visuals/PhonemeMapVisual.tsx`

**Porting notes:**
- Import from `./shared`.
- Layout is flex-based and self-adjusts to the new dimensions.
- No `hud-blink`.

- [ ] **Step 1: Create the file**

Path: `components/foam-pipeline/visuals/PhonemeMapVisual.tsx`

```typescript
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
```

- [ ] **Step 2: Type-check and commit**

```bash
npx tsc --noEmit
git add components/foam-pipeline/visuals/PhonemeMapVisual.tsx
git commit -m "feat(foam): port PhonemeMapVisual"
```

---

## Task 6: Port SamplerUiVisual

**Files:**
- Create: `components/foam-pipeline/visuals/SamplerUiVisual.tsx`
- Source: `/Users/erikparr/_sketches/portfolio-presentation/src/components/foam-visuals/SamplerUiVisual.tsx`

**Porting notes:**
- Import from `./shared`.
- Flex-based; self-adjusts.
- No `hud-blink`.

- [ ] **Step 1: Create the file**

Path: `components/foam-pipeline/visuals/SamplerUiVisual.tsx`

```typescript
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
```

`VISUAL_W` and `VISUAL_H` are used in the wrapper `style` object (`width`, `height`) — the imports are required, not decorative.

- [ ] **Step 2: Type-check and commit**

```bash
npx tsc --noEmit
git add components/foam-pipeline/visuals/SamplerUiVisual.tsx
git commit -m "feat(foam): port SamplerUiVisual"
```

---

## Task 7: Port SynthesisVisual and add barrel export

**Files:**
- Create: `components/foam-pipeline/visuals/SynthesisVisual.tsx`
- Create: `components/foam-pipeline/visuals/index.ts`
- Source: `/Users/erikparr/_sketches/portfolio-presentation/src/components/foam-visuals/SynthesisVisual.tsx`

**Porting notes:**
- Import from `./shared`.
- Hardcoded `waveTop = 26`, `waveH = 52`. At `VISUAL_H = 96`: wave ends at `y = 78`; footer sits at `bottom-0` absolute. Fits without modification.
- No `hud-blink`.

- [ ] **Step 1: Create `SynthesisVisual.tsx`**

Path: `components/foam-pipeline/visuals/SynthesisVisual.tsx`

```typescript
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
```

- [ ] **Step 2: Create the barrel export**

Path: `components/foam-pipeline/visuals/index.ts`

```typescript
export { TtsVisual } from "./TtsVisual";
export { AlignmentVisual } from "./AlignmentVisual";
export { PhonemeMapVisual } from "./PhonemeMapVisual";
export { SamplerUiVisual } from "./SamplerUiVisual";
export { SynthesisVisual } from "./SynthesisVisual";
```

- [ ] **Step 3: Type-check and commit**

```bash
npx tsc --noEmit
git add components/foam-pipeline/visuals/SynthesisVisual.tsx components/foam-pipeline/visuals/index.ts
git commit -m "feat(foam): port SynthesisVisual and add barrel export"
```

---

## Task 8: Build condensed `PipelineStage` (card + connector)

**Files:**
- Create: `components/foam-pipeline/PipelineStage.tsx`

**Design decisions from spec** (all captured in the code below):
- Single-row header: `num` + `title` left, `stack` right at `≥sm`; stack moves under title below `sm`.
- Drop body paragraph.
- Drop hairline between signature and body (no body now).
- Padding: `px-4 py-3` (condensed from source's `px-6 py-5`).
- Responsive grid: `grid-cols-1 sm:grid-cols-[1fr_auto]` so the visual stacks below copy on narrow viewports.
- Visual container has `max-w-full` so SVGs scale via their `viewBox`.
- Connector: single 20px vertical hairline; optional annotation chip (used only for `.phonemebundle`).

- [ ] **Step 1: Create the file**

Path: `components/foam-pipeline/PipelineStage.tsx`

```typescript
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
          <div
            className="shrink-0 w-full max-w-full sm:w-auto sm:self-stretch flex items-center sm:pl-5"
            style={{}}
          >
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
```

**Responsive behavior check:**
- `≥ 640px`: card uses 2-column grid, visual on the right with `sm:pl-5` gutter. Header is a single row with stack label right-aligned.
- `< 640px`: card becomes single-column (visual stacks below copy). Header flows to two rows (title on row 1, stack label on row 2). The `w-full max-w-full` on the visual wrapper constrains it to parent width; the inner visual's fixed `width: 240` is still set inline. Since 240px fits inside the modal content width on typical mobile viewports (375px minus padding), horizontal overflow should not trigger, but if it does, the `sm:w-auto` wrapper prevents propagation.

**Verification tip:** if 240px visual overflows narrow viewports, the fix is to wrap the visual with `overflow-hidden` — not to refactor the visual components. Check first in-browser.

- [ ] **Step 2: Type-check and commit**

```bash
npx tsc --noEmit
git add components/foam-pipeline/PipelineStage.tsx
git commit -m "feat(foam): build condensed PipelineStage card and connector"
```

---

## Task 9: Build `FoamPipeline` orchestrator

**Files:**
- Create: `components/foam-pipeline/FoamPipeline.tsx`

**Design decisions:**
- Small heading line: `PIPELINE · TEXT → SAMPLE` uppercase mono with a hairline underneath.
- Scope-class `foam-pipeline` applied on the root so scoped tokens cascade to children.
- Wraps `FOAM_STAGES` in a visual-key → component lookup.

- [ ] **Step 1: Create the file**

Path: `components/foam-pipeline/FoamPipeline.tsx`

```typescript
"use client";

import type { ReactElement } from "react";
import { FOAM_STAGES, CONNECTOR_ANNOTATIONS } from "./data";
import type { PipelineVisualKey } from "./types";
import { PipelineStageCard, StageConnector } from "./PipelineStage";
import {
  AlignmentVisual,
  PhonemeMapVisual,
  SamplerUiVisual,
  SynthesisVisual,
  TtsVisual,
} from "./visuals";

const VISUALS: Record<PipelineVisualKey, () => ReactElement> = {
  tts: TtsVisual,
  alignment: AlignmentVisual,
  "phoneme-map": PhonemeMapVisual,
  "sampler-ui": SamplerUiVisual,
  synthesis: SynthesisVisual,
};

export function FoamPipeline() {
  return (
    <section className="foam-pipeline border-t border-border-muted pt-4 mt-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.22em] text-border-accent">
          Pipeline · text → sample
        </h3>
        <span className="font-mono text-[10px] tabular-nums text-text-secondary">
          {FOAM_STAGES.length} stages
        </span>
      </div>

      <div className="flex flex-col items-stretch">
        {FOAM_STAGES.map((stage, i) => {
          const Visual = VISUALS[stage.visualKey];
          return (
            <div key={stage.num} className="flex flex-col items-stretch">
              <PipelineStageCard stage={stage} visual={<Visual />} />
              {i < FOAM_STAGES.length - 1 && (
                <StageConnector annotation={CONNECTOR_ANNOTATIONS[i]} />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

**Note on the heading:** it uses agent-viz's native tokens (`text-border-accent`, `text-text-secondary`, `border-border-muted`) because it sits at the boundary between the modal's chrome and the scoped FOAM pipeline block. Inside the 5 cards, the scoped CSS variables take over.

- [ ] **Step 2: Type-check and commit**

```bash
npx tsc --noEmit
git add components/foam-pipeline/FoamPipeline.tsx
git commit -m "feat(foam): build FoamPipeline orchestrator"
```

---

## Task 10: Wire `FoamPipeline` into `ProjectModal`

**Files:**
- Modify: `components/ProjectModal.tsx`

**Insertion point:** after the description `<p>` and before the `{project.details && ...}` block. Gate on `project.id === "foam"` so other projects are unaffected.

- [ ] **Step 1: Add the import**

Open `components/ProjectModal.tsx`. After the existing imports, add:

```typescript
import { FoamPipeline } from "./foam-pipeline/FoamPipeline";
```

The final import block should look like:

```typescript
"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TerminalChrome } from "./TerminalChrome";
import { ProjectMedia } from "./ProjectMedia";
import { FoamPipeline } from "./foam-pipeline/FoamPipeline";
import type { Project } from "@/lib/portfolioData";
```

- [ ] **Step 2: Render the pipeline conditionally**

Find the description `<p>` (roughly lines 85–87 of the current file):

```tsx
<p className="text-xs leading-relaxed text-text-primary">
  {project.description}
</p>

{project.details && (
```

Insert `{project.id === "foam" && <FoamPipeline />}` between them:

```tsx
<p className="text-xs leading-relaxed text-text-primary">
  {project.description}
</p>

{project.id === "foam" && <FoamPipeline />}

{project.details && (
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Smoke test in-browser**

Dev server should already be running. In the browser:

1. Open `http://localhost:3000`.
2. Scroll to find the FOAM project tile. Click it.
3. Verify in the open modal:
   - 3D FOAM logo still renders at the top.
   - Title and description render as before.
   - **Pipeline section appears between description and (nothing — FOAM has no `details`).**
   - Section heading `PIPELINE · TEXT → SAMPLE` with hairline under it.
   - 5 stage cards in order: TTS Generation → Forced Alignment · MFA → Phoneme Mapping → UI · Web + VST → Audio Synthesis.
   - Connector between card 3 and 4 shows `.phonemebundle` chip.
   - Final card (Audio Synthesis) has an accent-colored left edge and subtle tint.
   - Each card has a visual on the right — blinking cursor on TTS, waveform+alignment on MFA, phoneme chips on Mapping, grid/filter on Sampler, three overlaid wave voices on Synthesis.
4. Click another project (e.g., Intuitive Surgical). Confirm the pipeline does NOT render there.
5. Resize the browser to < 640px width (responsive mode). Confirm the stage cards stack (copy above, visual below, full width).

If any visual looks off (contrast too low, accent too loud), see the verification checkpoints in the design spec — minor CSS-variable tweaks can be made in `app/globals.css` without touching component code.

- [ ] **Step 5: Commit**

```bash
git add components/ProjectModal.tsx
git commit -m "feat(foam): render pipeline in FOAM project modal"
```

---

## Task 11: Final polish pass and production build verification

**Files:** any of the above, based on in-browser findings.

- [ ] **Step 1: Production build check**

Run: `npm run build`
Expected: build succeeds. No TypeScript errors, no runtime errors during prerendering.

If build fails on `"use client"` directives: the FOAM pipeline files that need `"use client"` are `PipelineStage.tsx` and `FoamPipeline.tsx` (they're rendered inside a client modal; the directive is already on both). The visual files don't need it (pure render functions, no hooks/events). The data/types files are plain TS.

- [ ] **Step 2: Review for any remaining polish**

With the modal open in the browser:
- Does the pipeline height feel balanced inside the modal? If it's too short or too tall, adjustment happens in `PipelineStage.tsx` padding (`py-3`) or `visuals/shared.ts` dimensions, not both.
- Is the accent color (`--color-step-tool: #2d5ff5`) appropriate for the blinking cursor, voice indicator, and final-stage edge? If too saturated, swap the scoped `--color-accent` mapping in `app/globals.css` from `var(--color-step-tool)` to `var(--color-border-accent)` (`#7d8ba0`).
- Any horizontal overflow at mobile widths? If the fixed `width: 240` on visuals causes the modal to scroll horizontally, wrap the visual in an `overflow-hidden` div in `PipelineStage.tsx`.

Make any small adjustments needed, then:

- [ ] **Step 3: Commit any polish changes**

```bash
git add -A  # or specific files
git commit -m "fix(foam): <describe adjustment>"
```

(Skip this step if no polish was needed.)

- [ ] **Step 4: Final smoke test**

1. Click FOAM project → modal opens → pipeline renders as expected.
2. Click another project → no pipeline.
3. Close modal with Escape, backdrop click, and `[close]` button — all work.
4. Scroll within the modal if content exceeds viewport — scroll works.

Done.

---

## Self-review summary

**Spec coverage:**
- Placement ✓ Task 10
- Footprint condensation ✓ Tasks 2 (shared constants 240×96), 8 (padding/connector)
- Visual fidelity + token bridge ✓ Task 1 (scoped tokens), Tasks 3–7 (1:1 ports with `hud-blink` → `blink` substitution)
- Text condensation (drop body, keep signature, single-row header) ✓ Tasks 2 (type/data), 8 (card layout)
- File structure ✓ Tasks 2–9
- Responsive stacking ✓ Task 8
- Verification checkpoints (contrast, accent brightness) ✓ Tasks 10–11

**Placeholder scan:** No TBDs. Each task contains full code or an exact edit instruction with the before/after snippet. External source files are referenced by path but not copied verbatim in the plan — only because the plan's code blocks ARE the authoritative content to paste.

**Type consistency:** `PipelineStage` (type), `PipelineVisualKey`, `FOAM_STAGES`, `CONNECTOR_ANNOTATIONS`, `PANGRAM`, `PANGRAM_PHONEMES`, `VISUAL_W`, `VISUAL_H` used consistently across Tasks 2–9. `FoamPipeline` (component) matches import in Task 10.
