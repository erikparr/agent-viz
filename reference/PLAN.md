# Agent Workflow Visualization: Implementation Plan

## Project Overview

Visualize a smolagents CodeAgent executing research tasks in real-time. The CodeAgent writes and runs Python code each step — searching, parsing, comparing — building toward a synthesized answer. The visualization renders this as a live terminal session with an animated crosshatch texture background.

**Goal:** Portfolio piece demonstrating AI agent reasoning + creative visualization.

**Design references:**
- Claude Code terminal UI (monospace, box-drawing borders, dark theme, orange accents)
- fiveonefour.com (Three.js crosshatch canvas texture, modern dark aesthetic)

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 14 (App Router) | SSR, API routes, Vercel deploy |
| **Styling** | Tailwind CSS | Dark theme, monospace design tokens |
| **Animation** | Framer Motion | Step transitions, node animations |
| **Background** | Three.js | Animated crosshatch texture canvas |
| **Visualization** | Custom SVG + Framer Motion | Terminal-style flow (lighter than React Flow) |
| **Agent** | smolagents CodeAgent (HuggingFace) | Writes + executes Python code per step |
| **LLM** | Claude via LiteLLM | Reasoning, tool use |
| **Streaming** | Server-Sent Events (SSE) | Real-time step updates |
| **Hosting** | Vercel | Free tier |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND                                                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Three.js Canvas (crosshatch background, z-0)            │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Next.js App (z-10)                                       │  │
│  │  ┌──────────┐ ┌──────────────────┐ ┌──────────────────┐  │  │
│  │  │ Query    │ │ AgentFlow        │ │ StepDetail       │  │  │
│  │  │ Input    │ │ (timeline +      │ │ (code + output   │  │  │
│  │  │ (prompt) │ │  flow nodes)     │ │  panels)         │  │  │
│  │  └──────────┘ └──────────────────┘ └──────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           │ SSE                                  │
├───────────────────────────┼─────────────────────────────────────┤
│  BACKEND                  │                                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  /api/agent (Next.js route)                               │  │
│  │  → spawns Python process                                  │  │
│  │  → streams JSON events as SSE                             │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  smolagents CodeAgent                               │  │  │
│  │  │  - WebSearchTool                                    │  │  │
│  │  │  - Writes Python code each step                     │  │  │
│  │  │  - Executes code, observes output, iterates         │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                    Claude API (via LiteLLM)                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Model

### Agent Step Event (SSE)

```typescript
interface AgentStep {
  type: 'thinking' | 'code' | 'tool_call' | 'tool_result' | 'final_answer' | 'error';
  stepNumber: number;
  timestamp: number;

  // Thinking — agent's reasoning
  thought?: string;

  // Code — Python code the agent wrote
  code?: string;

  // Code execution output
  codeOutput?: string;

  // Tool call (invoked within code)
  toolCall?: {
    name: string;
    arguments: Record<string, any>;
  };

  // Tool result
  toolResult?: {
    output: string;
    success: boolean;
  };

  // Final answer
  finalAnswer?: string;
}
```

### Agent Run State (frontend)

```typescript
interface AgentRun {
  id: string;
  query: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  steps: AgentStep[];
  error?: string;
}
```

---

## File Structure

```
agent-viz/
├── app/
│   ├── layout.tsx                # Root layout, font loading
│   ├── page.tsx                  # Main page
│   ├── globals.css               # Tailwind + terminal theme
│   └── api/
│       └── agent/
│           └── route.ts          # SSE endpoint
├── components/
│   ├── CrosshatchBackground.tsx  # Three.js canvas (background texture)
│   ├── TerminalChrome.tsx        # Box-drawing border wrapper
│   ├── QueryInput.tsx            # Terminal prompt input
│   ├── AgentFlow.tsx             # Main timeline visualization
│   ├── FlowNode.tsx              # Individual step node
│   ├── StepDetail.tsx            # Expandable code/output panel
│   └── PresetQueries.tsx         # Demo query buttons
├── lib/
│   ├── types.ts                  # TypeScript interfaces
│   └── demoData.ts               # Pre-recorded agent runs
├── hooks/
│   └── useAgentStream.ts         # SSE consumer hook
├── public/
│   └── fonts/                    # JetBrains Mono or similar
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── .env.local                    # ANTHROPIC_API_KEY (not committed)
```

---

## Implementation Phases

### Phase 1: Scaffold + Terminal Theme

1. Init Next.js 14 with TypeScript + Tailwind
2. `npm install framer-motion three @types/three`
3. Configure monospace font (JetBrains Mono)
4. Set up dark terminal theme tokens in Tailwind config
5. Build `TerminalChrome` — reusable box-drawing border container
6. Build root layout with terminal chrome and title bar

**Deliverable:** Terminal-styled app shell.

---

### Phase 2: Three.js Crosshatch Background

1. Build `CrosshatchBackground` component — fixed canvas behind UI
2. Line geometry or custom shader rendering animated crosshatch pattern
3. Subtle, low-opacity — adds texture without competing with content
4. Reactive to agent state passed via props/context:
   - Idle: slow gentle drift
   - Running: increased line density/movement
   - Complete: settles

**Deliverable:** Animated background texture layer.

---

### Phase 3: Demo Data + SSE

1. Define `AgentStep` / `AgentRun` types in `lib/types.ts`
2. Create 2-3 pre-recorded demo runs in `lib/demoData.ts`:
   - "Compare the AI strategies of Apple and Google"
   - "What are the top 3 most populated cities in Europe?"
   - Each run has 4-6 steps: thinking → code → tool_call → tool_result → thinking → final_answer
3. Build `/api/agent/route.ts` — replays demo data with timed SSE delays
4. Build `useAgentStream` hook — connects to SSE, populates `AgentRun` state

**Deliverable:** Working data pipeline from API to frontend state.

---

### Phase 4: Frontend Visualization

1. **QueryInput** — terminal prompt style (`> ` prefix, blinking cursor), preset query buttons
2. **AgentFlow** — horizontal timeline with SVG connecting lines (dashed, ASCII-inspired)
3. **FlowNode** — box-drawing bordered cards, color-coded by step type:
   - Thinking: blue border
   - Code: green border (shows Python snippet)
   - Tool call: orange border
   - Tool result: purple border
   - Final answer: amber border
4. **StepDetail** — click a node to expand code + output below in monospace panel
5. Framer Motion: nodes animate in (scale + fade), connections draw, active node pulses

**Deliverable:** Working visualization rendering demo agent runs.

---

### Phase 5: Real Agent Backend (later)

1. Python smolagents wrapper script
2. API route spawns process, pipes JSON events as SSE
3. Demo/live mode toggle

**Deliverable:** Live agent execution.

---

### Phase 6: Polish + Deploy

1. Loading states (terminal spinner characters)
2. Error handling UI
3. Mobile responsive
4. Vercel deploy, demo mode as default

**Deliverable:** Deployed portfolio piece.

---

## Visual Design

### Terminal Theme

- **Font:** JetBrains Mono (monospace throughout)
- **Borders:** ASCII box-drawing characters rendered via CSS/SVG
- **Title bars:** Label text embedded in top border (like Claude Code's `── Claude Code v2.1.79 ──`)

### Color Palette

```
Background:     #09090b  (zinc-950)
Surface:        #18181b  (zinc-900)
Border:         #f97316  (orange-500, primary accent)
Border muted:   #78716c  (stone-500)
Text primary:   #fafafa  (zinc-50)
Text secondary: #a1a1aa  (zinc-400)

Step colors:
  Thinking:     #3b82f6  (blue-500)
  Code:         #22c55e  (green-500)
  Tool call:    #f97316  (orange-500)
  Tool result:  #a855f7  (purple-500)
  Final answer: #f59e0b  (amber-500)
  Error:        #ef4444  (red-500)
```

### Crosshatch Background

- Three.js canvas, position fixed, z-index 0
- Thin lines at 45/-45 degrees, low opacity (~0.05-0.1)
- Slow animation: lines drift, density shifts
- Responds to agent state changes

### Animation Specs

- **Node appear:** scale 0→1, opacity 0→1, 300ms ease-out
- **Connection draw:** SVG stroke-dashoffset animation, 200ms
- **Active pulse:** scale 1→1.03→1, 1.5s loop
- **Background shift:** crosshatch density ramps over 500ms when agent starts

---

## Demo Queries

Research-oriented queries that produce multi-step CodeAgent flows:
1. "Compare the AI strategies of Apple and Google"
2. "What are the top 3 most populated cities in Europe and their populations?"
3. "Find recent breakthroughs in quantum computing"

---

## API Keys

| Service | Variable | Purpose |
|---------|----------|---------|
| Anthropic | `ANTHROPIC_API_KEY` | Claude for CodeAgent LLM |
| (Optional) Brave | `BRAVE_API_KEY` | WebSearchTool |

Demo mode requires no API keys.

---

## Future Enhancements (Post-MVP)

- Multi-agent visualization (manager + sub-agents as tree)
- Side-by-side run comparison
- Share/embed runs via URL
- Export as video/GIF
- Code execution replay (step through code line by line)

---

*Plan updated: 2026-03-19*
*Start simple, iterate with new content and ideas*
