# FOAM Pipeline Flow Diagram in Project Modal

**Date:** 2026-04-16
**Status:** Design approved, pending implementation plan

## Goal

Add a 5-stage visual flow diagram to the FOAM project modal in `agent-viz`, ported and condensed from the existing vertical pipeline in `/Users/erikparr/_sketches/portfolio-presentation`. When a visitor clicks the FOAM project and the modal expands, they should see — below the 3D hero and description — a technical pipeline showing how FOAM moves text through to a playable sample.

The source visualizations are the most important part and must be preserved at high fidelity. Surrounding text and chrome are condensed to fit the modal footprint.

## Placement

Inside `components/ProjectModal.tsx`, the pipeline renders after the description paragraph and before `project.details`:

```
TerminalChrome
 └─ close button
 └─ ProjectMedia (3D FoamLogo hero)
 └─ title
 └─ roles line
 └─ description
 └─ <FoamPipeline />          ← new, FOAM only
 └─ details (none for FOAM)
 └─ categories + link
```

The 3D hero is kept (not replaced). The pipeline is an additional section that adds technical depth for readers who engage past the description.

## Footprint condensation

The source pipeline at full size is ~1000px tall. Modal `max-h-90vh` (~800–900px) already spends ~400px on close button, 3D hero, title, and description, leaving ~400–500px before scroll kicks in. The modal scrolls anyway, but the pipeline should feel tight.

Per-stage condensation:

| Element | Source | Condensed |
|---|---|---|
| Card padding | `px-6 py-5` | `px-4 py-3` |
| Visual dimensions | 260 × 108 | **240 × 96** |
| Card total height | ~150px | **~115px** |
| Connector | 28px + 20px rule + chevron | single 20px vertical hairline |
| `.phonemebundle` connector chip | keep | keep (only meaningful annotation) |
| Source view header/footer | present | **dropped** — modal provides its own |

**Total pipeline height:** ~5 × 115 + 4 × 20 + small section heading = **~640px**, scrollable within the modal.

## Visual fidelity & token bridge

The 5 source visuals (`TtsVisual`, `AlignmentVisual`, `PhonemeMapVisual`, `SamplerUiVisual`, `SynthesisVisual`) reference CSS variables that don't exist in `agent-viz`:

```
--color-surface, --color-surface-2, --color-bg-deep,
--color-hairline, --color-hairline-strong,
--color-text, --color-text-dim, --color-text-mute,
--color-accent, --radius-panel, --radius-chip
animation: hud-blink
```

**Strategy — scoped token bridge.** Introduce the source's variables only within a `.foam-pipeline` scope in `app/globals.css`. Visuals port essentially as-is; nothing leaks to the rest of the app. The FOAM pipeline inherits the scoped tokens which resolve to `agent-viz`'s existing palette.

Concrete mapping using the tokens already declared in `app/globals.css`:

```css
.foam-pipeline {
  --color-surface:         var(--color-bg-surface);    /* #0c1017 */
  --color-surface-2:       var(--color-bg-elevated);   /* #151b25 */
  --color-bg-deep:         var(--color-bg-primary);    /* #050709 — backdrop for inner visuals */
  --color-hairline:        var(--color-border-muted);  /* #334155 */
  --color-hairline-strong: var(--color-border-accent); /* #7d8ba0 */
  --color-text:            var(--color-text-primary);  /* #f1f5f9 */
  --color-text-dim:        var(--color-text-secondary);/* #94a3b8 */
  --color-text-mute:       color-mix(in oklch, var(--color-text-secondary) 55%, transparent);
  --color-accent:          var(--color-step-tool);     /* #2d5ff5 */
  --radius-panel: 4px;
  --radius-chip: 2px;
}
```

`hud-blink` animation: `app/globals.css` already defines `@keyframes blink` (step-end, 1s) for the terminal cursor. The source's `hud-blink` uses the same visual behavior (binary on/off at 1.2s). Reuse `blink`; in ported visuals, replace `animate-[hud-blink_1.2s_steps(1,end)_infinite]` with `animate-[blink_1.2s_steps(1,end)_infinite]`. No new keyframes required.

**Verification checkpoints** (to flag in the implementation plan):

1. Visual-to-card contrast — `--color-bg-deep` (`#050709`) vs `--color-surface` (`#0c1017`) is subtle; confirm inner visuals read as distinct surfaces in the browser.
2. Accent brightness — `#2d5ff5` is more saturated than the source's accent. Confirm the blinking cursor, voice indicator, and final-stage emphasis edge land correctly; if too loud, substitute `--color-border-accent` (`#7d8ba0`) for `--color-accent`.

## Text condensation

The source stage card carries: `num`, `title`, `signature`, `body`, `stack`. In a modal that already has a ~150-word description, the per-stage body is redundant with the visual + signature.

| Layer | Decision | Reason |
|---|---|---|
| `num` ("01".."05") | keep | visual anchor, no cost |
| `title` ("TTS Generation") | keep | stage identity |
| `signature` ("text → speech waveform") | **keep as primary caption** | already terse, does the body's job |
| `body` (1 sentence) | **drop** | visual + signature + title carry the meaning |
| `stack` ("React · FastAPI · ElevenLabs") | keep, small | technical depth is the pipeline's whole point |
| `.phonemebundle` connector chip | keep | the one payoff annotation worth retaining |

**Card layout** — single-row header (`num` + `title` left, `stack` right), signature as second line, visual on the right.

**Section heading** — one thin line above the cards, uppercase/mono, e.g. `PIPELINE · TEXT → SAMPLE`, with a hairline under it. Replaces the dropped source view header.

## File structure

New files under `components/foam-pipeline/`:

```
components/foam-pipeline/
  FoamPipeline.tsx          # orchestrator: heading, 5 cards + connectors
  PipelineStage.tsx         # card + connector (ported, condensed)
  data.ts                   # FOAM_STAGES + PANGRAM + PANGRAM_PHONEMES
  types.ts                  # PipelineStage, PipelineVisualKey
  visuals/
    index.ts
    TtsVisual.tsx
    AlignmentVisual.tsx
    PhonemeMapVisual.tsx
    SamplerUiVisual.tsx
    SynthesisVisual.tsx
```

Modified files:

- `app/globals.css` — append scoped `.foam-pipeline { ... }` token block and `hud-blink` keyframes
- `components/ProjectModal.tsx` — render `<FoamPipeline />` after the description, gated on `project.id === "foam"`

**Why a dedicated directory:** five visuals + shared data + types is enough weight that a single file would hurt readability. Grouping under `components/foam-pipeline/` matches existing per-feature grouping (`components/sandbox/`).

**Why no generic `pipeline` field on `Project`:** only FOAM has one. YAGNI — a single explicit `project.id === "foam"` branch is clearer than introducing a schema extension no other project uses.

## Responsive behavior

Modal is `max-w-4xl` (~896px). Desktop fits the source `grid-cols-[1fr_auto]` layout comfortably with a 240px visual. Mobile needs stacking.

| Viewport | Card layout | Visual |
|---|---|---|
| ≥ 640px (`sm`) | Copy left, visual right | 240 × 96 |
| < 640px | Copy top, visual below, full width | width: 100%, height proportional via SVG viewBox |

Implementation notes:

- Grid switches from `grid-cols-[1fr_auto]` to `grid grid-cols-1 sm:grid-cols-[1fr_auto]`.
- Visuals have a fixed `width: 240` today; wrap in a `max-w-full` container and let the internal SVG `viewBox` handle scaling.
- `stack` label moves under the title on mobile (not right-aligned) to avoid truncation.
- Connector (20px vertical hairline) unchanged across breakpoints.

On mobile, stacked cards grow to ~200px each. Total pipeline ≈ 1000px, within the modal's existing scroll context. No new scroll container introduced.

## Out of scope

- No changes to `Project` type or `portfolioData.ts`.
- No changes to other project modals.
- No changes to the 3D hero (`FoamLogo3D`).
- No re-port of the source view's header/footer (`05 · FOAM`, `Pipeline`, `Stages 5`, footer line) — the modal provides its own surrounding context.
- No body-text per stage (may be revisited if the pipeline feels too terse in-browser).
