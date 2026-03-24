# Expanded Intuitive Surgical modal

## Problem

The Intuitive Surgical portfolio item is the most impressive and recent work but only has a two-sentence description. It needs structured detail to communicate scope and depth to prospective employers/clients evaluating design engineering capability.

## Decision: enhanced modal, no tabs, Intuitive only

- Rich content renders inside the existing click-to-open ProjectModal
- No tabs. Flat vertical scroll: headed prose sections
- Only the Intuitive project gets `details` for now. All other projects render unchanged.
- No new dependencies or components

## Data model change

Add an optional `details` field to the `Project` interface in `lib/portfolioData.ts`:

```typescript
export interface ProjectDetail {
  heading: string;
  body: string; // prose paragraph, no bullets
}

export interface Project {
  // ...existing fields
  details?: ProjectDetail[];
}
```

## Content for Intuitive Surgical details

### Section 1: "Context"

I was the sole design technologist in Intuitive's Advanced Product Design group, working on problems 2-3 years ahead of shipping product. The challenge: surgeons produce huge volumes of data per procedure (video, instrument telemetry, system events) and have no good way to learn from any of it post-op. Everything was built locally under HIPAA constraints. The research that would eventually define what this product category even was hadn't been published yet, so requirements had to be invented alongside the science.

### Section 2: "3D surgical tool path visualization"

Real-time 3D rendering of robotic instrument paths in Three.js. For the first time you could actually see how a surgeon's technique plays out spatially: where instruments went, how much force was applied, how movement tracks against procedure phase.

### Section 3: "AI case summarization"

A local LLM system that turns structured surgical data into plain-language case summaries. ML segmentation breaks each procedure into phases, tasks, and steps. Surgeons can read what happened instead of parsing raw data.

### Section 4: "Adaptive case explorer"

A year-long prototype that watches for unusual patterns in a procedure and pulls up the relevant data on its own, alongside historical comparisons, without anyone asking for it. Adapts to individual usage patterns over time. The core bet that held up through the whole project: users don't want all the data, they want the parts that matter.

### Section 5: "Outcomes"

Ran a human factors study with a surgeon panel. Core assumptions confirmed. Presented to upper management; received well. Product requirements were defined from research that was still being published during the build.

## Rendering changes in ProjectModal.tsx

When `project.details` exists, render after the existing description:

- Each detail section: heading + body paragraph
- Heading: small caps or accent-colored, matching existing `text-border-accent` pattern
- Body: `text-xs leading-relaxed text-text-secondary` for readable prose
- Subtle `border-t border-border-muted` between sections for visual rhythm
- No bullets, no icons, no bold inline headers

The existing short `description` stays as-is for card preview (line-clamped to 2 lines in ProjectCard). The `details` array only appears in the expanded modal.

## Files changed

1. `lib/portfolioData.ts` - add `ProjectDetail` type, add `details?` to `Project` interface, add content to intuitive entry
2. `components/ProjectModal.tsx` - render `details` sections when present

## Out of scope

- Tabs or ContentBlock reuse (decided against)
- Additional images/video (NDA restricted)
- Expanding other projects (Intuitive only for now)
- New routes or pages
