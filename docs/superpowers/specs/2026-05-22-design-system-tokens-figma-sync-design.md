# Design System — Token Sync to Figma (Pass 1)

## Goal

Mirror the existing agent-viz design tokens defined in `app/globals.css` into a new Figma file as Variables, establishing a contract for future component passes. Tokens-only scope; components, spacing customization, shadows, and multi-mode theming are explicitly deferred.

## Source of Truth

**Code → Figma, one-way for this pass.** `app/globals.css` (`@theme` block + `.foam-pipeline` scoped vars) is canonical. Figma variables mirror it. Direction may flip in later passes once components are in Figma.

## Figma File

- Created via `figma-create-new-file design`
- Single mode per collection (site is dark-only today; structure leaves room to add `light` later without refactor)

## Variable Collections

### `Color/Primitives` (internal)

Raw hex values, not consumed directly by components. Exists so semantic tokens have something to alias.

| Token | Value |
|---|---|
| `slate-950` | `#050709` |
| `slate-900` | `#0c1017` |
| `slate-850` | `#151b25` |
| `slate-700` | `#334155` |
| `slate-500` | `#7d8ba0` |
| `slate-400` | `#94a3b8` |
| `slate-200` | `#e2e8f0` |
| `slate-100` | `#f1f5f9` |
| `slate-50`  | `#f8fafc` |
| `gray-300`  | `#b0bec9` |
| `green-400` | `#4ade80` |
| `blue-600`  | `#2d5ff5` |
| `red-400`   | `#f87171` |

### `Color/Semantic`

Names mirror CSS vars 1:1 so a designer and a developer can speak the same word.

| Token | Aliased to | CSS var |
|---|---|---|
| `bg/primary` | `slate-950` | `--color-bg-primary` |
| `bg/surface` | `slate-900` | `--color-bg-surface` |
| `bg/elevated` | `slate-850` | `--color-bg-elevated` |
| `border/accent` | `slate-500` | `--color-border-accent` |
| `border/muted` | `slate-700` | `--color-border-muted` |
| `text/primary` | `slate-100` | `--color-text-primary` |
| `text/secondary` | `slate-400` | `--color-text-secondary` |
| `accent` | `blue-600` | `--color-accent` (foam-pipeline scope) |

### `Color/Step`

Semantically distinct from UI chrome — used by agent-flow visualizations.

| Token | Aliased to | CSS var |
|---|---|---|
| `step/thinking` | `gray-300` | `--color-step-thinking` |
| `step/code` | `green-400` | `--color-step-code` |
| `step/tool` | `blue-600` | `--color-step-tool` |
| `step/result` | `slate-200` | `--color-step-result` |
| `step/final` | `slate-50` | `--color-step-final` |
| `step/error` | `red-400` | `--color-step-error` |

### `Radius`

All five observed values preserved — they are already minimal and intentional.

| Token | Value (px) |
|---|---|
| `xs` | 1.5 |
| `sm` | 2 |
| `md` | 3 |
| `lg` | 4 |
| `full` | 9999 |

### `Typography`

**Family** — single token:
- `font/mono` → `"JetBrains Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace`

**Size ramp** — normalized from 11 arbitrary `text-[Npx]` values. `.5px` values rounded; they were pixel-snapping artifacts of monospace at small sizes.

| Token | Value (px) | Replaces |
|---|---|---|
| `size/7` | 7 | `text-[7.5px]` |
| `size/8` | 8 | `text-[8px]`, `text-[8.5px]` |
| `size/9` | 9 | `text-[9px]`, `text-[9.5px]` |
| `size/10` | 10 | `text-[10px]`, `text-[10.5px]` |
| `size/11` | 11 | `text-[11px]` |
| `size/12` | 12 | `text-[12.5px]`, Tailwind `text-xs` |
| `size/13` | 13 | `text-[13px]` |
| `size/14` | 14 | Tailwind `text-sm` |
| `size/18` | 18 | Tailwind `text-lg` |
| `size/24` | 24 | Tailwind `text-2xl` |

Component code is **not** changed in this pass — the ramp documents what the Figma scale snaps to. A future codemod pass can collapse arbitrary sizes onto these tokens.

## Out of Scope

- Components (buttons, cards, modals, chrome) — Pass 2
- Spacing tokens — Tailwind defaults remain canonical
- Shadows — none in use
- Light mode — structure permits future addition, not built now
- Code Connect mappings — Pass 3
- Motion/easing tokens, z-index scale

## Deliverable

1. New Figma file (URL captured in implementation plan output)
2. Variable collections above, populated and aliased correctly
3. This spec committed as the mapping contract

## Workflow For This Pass

1. Create new Figma file (`figma-create-new-file design "Agent-viz Design System"`)
2. Use `figma-use` to create variable collections in order: Primitives → Semantic → Step → Radius → Typography
3. Verify aliases resolve and a quick swatch frame renders the semantic tokens
4. Capture file URL and append to spec

---

## Figma File URL

https://www.figma.com/design/5Q7sbK0JzshkjmOZVaHV61

## Final Variable Counts

| Collection | Count | Type |
|---|---|---|
| Color/Primitives | 13 | COLOR (raw hex) |
| Color/Semantic | 8 | COLOR (aliased) |
| Color/Step | 6 | COLOR (aliased) |
| Radius | 5 | FLOAT |
| Typography | 11 | 1 STRING (`font/mono`) + 10 FLOAT (size ramp) |
| **Total** | **43** | |

Verification frame: `Token Verification — Pass 1` (node `4:2`) on Page 1.
