# Color System

## Overview

The dither renderer uses a two-pass WebGL pipeline. Pass 1 renders a 3D blob to an offscreen texture. Pass 2 applies a Bayer dither shader that maps luminance to two-color output. The color system controls what colors the dither shader uses, independently for the blob and the background.

## Architecture

```
┌─────────────────────────────────────────────────┐
│ Pass 1: 3D Scene → Render Target                │
│   Blob (simplex noise displaced sphere)         │
│   Black background                              │
│   Output: grayscale luminance texture            │
├─────────────────────────────────────────────────┤
│ Pass 2: Dither Shader                            │
│   Reads luminance texture                        │
│   Bayer 4x4 ordered dithering                    │
│   Per-pixel: is this blob or background?         │
│     blob → mix(uColorA, uColorB, dithered)       │
│     bg   → mix(uColorA, uColorBg, dithered)      │
└─────────────────────────────────────────────────┘
```

## Color Uniforms

| Uniform    | Role                     | Default     | Changes? |
|------------|--------------------------|-------------|----------|
| `uColorA`  | Dark base color          | `#0a0e14`   | No       |
| `uColorB`  | Blob dither highlight    | `#9A8EC2`   | Yes — animated via color wandering |
| `uColorBg` | Background dither highlight | `#e8e4d9` (bone) | No |

### Object vs Background Detection

The scene renders the blob on a black background. Background pixels have luminance ≈ 0, blob pixels have luminance > 0. The shader uses `step(0.01, luma)` to classify each pixel, then selects `uColorBg` (bone) or `uColorB` (blob color) as the dither highlight.

## Color Wandering Animation

When a user action triggers `flashColor()`, the blob highlight color (`uColorB`) animates through a sequence of colors before returning to the default.

### Sequence

```
idle (#9A8EC2) → wandering (3s) → returning (1s) → idle
```

1. **Idle** — `uColorB` lerps toward default `#9A8EC2`
2. **Wandering** (3 seconds) — smoothly transitions through 5 randomly selected colors from a 20-color palette
3. **Returning** (1 second) — lerps back to default in OKLab space

### OKLab Color Space

All color interpolation happens in OKLab, a perceptually uniform color space. This means equal distances in OKLab correspond to equal perceived color differences, producing smoother and more natural transitions than RGB interpolation.

Conversion pipeline: `sRGB hex → linear RGB → LMS (cone response) → OKLab (L, a, b)`

- **L** — lightness (0–1)
- **a** — green ↔ red axis (≈ -0.4 to +0.4)
- **b** — blue ↔ yellow axis (≈ -0.4 to +0.4)

Utilities in `lib/oklab.ts`: `hexToOklab`, `oklabToHex`, `oklabToSrgb`, `srgbToOklab`, `oklabLerp`, `isInGamut`.

### Catmull-Rom Spline Interpolation

Waypoints are interpolated using Catmull-Rom cubic splines rather than linear lerp. This produces smooth curves with tangent continuity — the color path curves naturally through each waypoint instead of making sharp direction changes.

For endpoints, the first/last control points are duplicated to define tangents.

### Speed Variation

The progress along the spline is modulated by:

```
speedMod = 1.0 + 0.15 * sin(dt * 7.3) + 0.1 * sin(dt * 3.1)
```

Two sine waves at incommensurate frequencies create organic acceleration and deceleration — the color lingers in some regions and moves quickly through others, avoiding a mechanical feel.

## Palette

20 colors, mixed vibrant and subdued:

```
Vibrant:
  #FF4900  #EE0050  #5F2DFF  #75F000  #00B4FF
  #FF00AA  #FFD600  #00FFC8  #FF6B35  #8B00FF

Saturated mid:
  #E8453C  #2D9CDB  #27AE60  #F2994A  #9B51E0

Subdued / desaturated:
  #7A8B6E  #A89078  #6B7F99  #9E8A7C  #708078
```

On each trigger, 5 colors are randomly selected (without replacement) from this palette. The current color is prepended as the first waypoint to ensure a smooth start.

## Sandbox Pages

### `/sandbox/dither`
Interactive dither renderer with a flash button. Tests the full pipeline.

### `/sandbox/oklab`
OKLab color space visualizer:
- Renders the sRGB gamut as a 2D a-b plane at adjustable lightness (L)
- Plots all 20 palette colors at their OKLab positions
- Shows animated color path with fading trail
- Compares RGB vs OKLab interpolation paths
- Speed curve visualization with playhead

## Key Files

| File | Purpose |
|------|---------|
| `components/sandbox/DitherRenderer.tsx` | Main renderer: blob geometry, dither shader, color animation |
| `lib/oklab.ts` | OKLab ↔ sRGB conversion utilities |
| `app/sandbox/oklab/page.tsx` | OKLab color space sandbox |
| `app/sandbox/dither/page.tsx` | Dither sandbox |
| `app/page.tsx` | Main page — triggers `flashColor()` on query submit |
