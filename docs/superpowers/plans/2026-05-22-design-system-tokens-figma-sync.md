# Design System — Token Sync to Figma (Pass 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a new Figma file mirroring the token definitions in `app/globals.css` as Figma Variables, organized into five collections.

**Architecture:** One-way sync, code → Figma. The Figma MCP plugin's `figma-create-new-file` skill creates the file; `figma-use` skill executes Plugin API JS to create variable collections and aliased variables. No code changes in this pass — `app/globals.css` remains canonical.

**Tech Stack:** Figma MCP server (`mcp__figma__*` tools), Figma plugin skills (`figma:figma-create-new-file`, `figma:figma-use`), Figma Plugin API (`figma.variables.*`).

**Source spec:** `docs/superpowers/specs/2026-05-22-design-system-tokens-figma-sync-design.md`

---

## Preflight

### Task 0: Verify Figma MCP is connected and authenticated

**Files:** none

- [ ] **Step 1: Confirm Figma MCP tools are available in the session**

The session should expose `mcp__figma__authenticate` and the `figma:*` skills. If not, ask the user to restart Claude Code so the recently installed `figma@claude-plugins-official` plugin loads.

- [ ] **Step 2: Confirm authentication**

If `mcp__figma__authenticate` has not been completed in this account, invoke it and follow the prompt. Expected: a successful auth confirmation message.

---

## Create the file

### Task 1: Create a new Figma design file

**Files:**
- Create (in Figma): "Agent-viz Design System"

- [ ] **Step 1: Invoke `figma:figma-create-new-file` skill first**

Per skill rules: the create-new-file skill is a mandatory prerequisite before calling `create_new_file`. Invoke it via the Skill tool.

- [ ] **Step 2: Create the file**

Use the parameters described by the skill. Editor type: `design`. File name: `Agent-viz Design System`.

- [ ] **Step 3: Capture the file URL**

Append the returned URL to the spec doc under a new `## Figma File URL` section at the bottom:

```bash
# Manually edit docs/superpowers/specs/2026-05-22-design-system-tokens-figma-sync-design.md
# Append:
#
# ## Figma File URL
# <pasted URL>
```

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/specs/2026-05-22-design-system-tokens-figma-sync-design.md
git commit -m "design-system: record Figma file URL for token sync pass 1"
```

---

## Populate variable collections

For every `figma-use` call: **invoke the `figma:figma-use` skill first** (mandatory prerequisite per skill metadata). Pass the Plugin API JS shown in each task as the script to execute.

### Task 2: Create `Color/Primitives` collection

**Files:** none (Figma-only)

- [ ] **Step 1: Invoke `figma:figma-use` skill**

- [ ] **Step 2: Run this Plugin API script via `use_figma`**

```js
const collection = figma.variables.createVariableCollection("Color/Primitives");
const modeId = collection.modes[0].modeId;

const hex = (h) => {
  const n = h.replace("#", "");
  return {
    r: parseInt(n.slice(0,2), 16) / 255,
    g: parseInt(n.slice(2,4), 16) / 255,
    b: parseInt(n.slice(4,6), 16) / 255,
  };
};

const primitives = {
  "slate-950": "#050709",
  "slate-900": "#0c1017",
  "slate-850": "#151b25",
  "slate-700": "#334155",
  "slate-500": "#7d8ba0",
  "slate-400": "#94a3b8",
  "slate-200": "#e2e8f0",
  "slate-100": "#f1f5f9",
  "slate-50":  "#f8fafc",
  "gray-300":  "#b0bec9",
  "green-400": "#4ade80",
  "blue-600":  "#2d5ff5",
  "red-400":   "#f87171",
};

const created = {};
for (const [name, value] of Object.entries(primitives)) {
  const v = figma.variables.createVariable(name, collection, "COLOR");
  v.setValueForMode(modeId, hex(value));
  created[name] = v.id;
}

return { collectionId: collection.id, modeId, ids: created };
```

- [ ] **Step 3: Verify**

Expected return: a `collectionId`, `modeId`, and an `ids` map with 13 entries. Save these — Task 3, 4 alias against them.

- [ ] **Step 4: Commit (intermediate checkpoint — record IDs)**

Append the returned `ids` map to the spec under `## Figma File URL` so subsequent tasks have a stable reference:

```bash
git add docs/superpowers/specs/2026-05-22-design-system-tokens-figma-sync-design.md
git commit -m "design-system: add Color/Primitives variable IDs"
```

### Task 3: Create `Color/Semantic` collection with aliases to primitives

**Files:** none

- [ ] **Step 1: Invoke `figma:figma-use` skill**

- [ ] **Step 2: Run this Plugin API script via `use_figma`**

Pass the `primitiveIds` map from Task 2 into the script (substitute the actual IDs returned).

```js
const PRIMITIVE_IDS = /* paste Task 2 ids map here */;

const collection = figma.variables.createVariableCollection("Color/Semantic");
const modeId = collection.modes[0].modeId;

const semantic = {
  "bg/primary":      "slate-950",
  "bg/surface":      "slate-900",
  "bg/elevated":     "slate-850",
  "border/accent":   "slate-500",
  "border/muted":    "slate-700",
  "text/primary":    "slate-100",
  "text/secondary":  "slate-400",
  "accent":          "blue-600",
};

const created = {};
for (const [name, primName] of Object.entries(semantic)) {
  const v = figma.variables.createVariable(name, collection, "COLOR");
  v.setValueForMode(modeId, {
    type: "VARIABLE_ALIAS",
    id: PRIMITIVE_IDS[primName],
  });
  created[name] = v.id;
}

return { collectionId: collection.id, modeId, ids: created };
```

- [ ] **Step 3: Verify**

Expected return: 8 aliased variables. In Figma, open Variables panel → each Semantic var should display its primitive name as the resolved value.

### Task 4: Create `Color/Step` collection with aliases to primitives

**Files:** none

- [ ] **Step 1: Invoke `figma:figma-use` skill**

- [ ] **Step 2: Run this Plugin API script via `use_figma`**

```js
const PRIMITIVE_IDS = /* paste Task 2 ids map here */;

const collection = figma.variables.createVariableCollection("Color/Step");
const modeId = collection.modes[0].modeId;

const step = {
  "step/thinking": "gray-300",
  "step/code":     "green-400",
  "step/tool":     "blue-600",
  "step/result":   "slate-200",
  "step/final":    "slate-50",
  "step/error":    "red-400",
};

const created = {};
for (const [name, primName] of Object.entries(step)) {
  const v = figma.variables.createVariable(name, collection, "COLOR");
  v.setValueForMode(modeId, {
    type: "VARIABLE_ALIAS",
    id: PRIMITIVE_IDS[primName],
  });
  created[name] = v.id;
}

return { collectionId: collection.id, modeId, ids: created };
```

- [ ] **Step 3: Verify**

Expected: 6 aliased variables in `Color/Step`. Confirm in Variables panel that each resolves to the correct primitive color.

### Task 5: Create `Radius` collection

**Files:** none

- [ ] **Step 1: Invoke `figma:figma-use` skill**

- [ ] **Step 2: Run this Plugin API script via `use_figma`**

```js
const collection = figma.variables.createVariableCollection("Radius");
const modeId = collection.modes[0].modeId;

const radii = {
  "xs":   1.5,
  "sm":   2,
  "md":   3,
  "lg":   4,
  "full": 9999,
};

const created = {};
for (const [name, value] of Object.entries(radii)) {
  const v = figma.variables.createVariable(name, collection, "FLOAT");
  v.setValueForMode(modeId, value);
  created[name] = v.id;
}

return { collectionId: collection.id, modeId, ids: created };
```

- [ ] **Step 3: Verify**

Expected: 5 FLOAT variables, values exactly `1.5, 2, 3, 4, 9999`.

### Task 6: Create `Typography` collection (family + size ramp)

**Files:** none

- [ ] **Step 1: Invoke `figma:figma-use` skill**

- [ ] **Step 2: Run this Plugin API script via `use_figma`**

```js
const collection = figma.variables.createVariableCollection("Typography");
const modeId = collection.modes[0].modeId;

const family = figma.variables.createVariable("font/mono", collection, "STRING");
family.setValueForMode(
  modeId,
  '"JetBrains Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'
);

const sizes = [7, 8, 9, 10, 11, 12, 13, 14, 18, 24];
const sizeIds = {};
for (const px of sizes) {
  const v = figma.variables.createVariable(`size/${px}`, collection, "FLOAT");
  v.setValueForMode(modeId, px);
  sizeIds[`size/${px}`] = v.id;
}

return {
  collectionId: collection.id,
  modeId,
  ids: { "font/mono": family.id, ...sizeIds },
};
```

- [ ] **Step 3: Verify**

Expected: 1 STRING variable (`font/mono`) and 10 FLOAT variables (`size/7` through `size/24`). Total 11 variables in the collection.

---

## Sanity-check swatch frame

### Task 7: Render a verification frame using the new tokens

**Files:** none (Figma-only)

- [ ] **Step 1: Invoke `figma:figma-use` skill**

- [ ] **Step 2: Run this Plugin API script via `use_figma`**

Pass both `SEMANTIC_IDS` (Task 3) and `STEP_IDS` (Task 4).

```js
const SEMANTIC_IDS = /* paste Task 3 ids map here */;
const STEP_IDS     = /* paste Task 4 ids map here */;

const frame = figma.createFrame();
frame.name = "Token Verification — Pass 1";
frame.resize(640, 320);
frame.layoutMode = "VERTICAL";
frame.itemSpacing = 16;
frame.paddingLeft = frame.paddingRight = frame.paddingTop = frame.paddingBottom = 24;
frame.fills = [
  figma.variables.setBoundVariableForPaint(
    { type: "SOLID", color: { r: 0, g: 0, b: 0 } },
    "color",
    figma.variables.getVariableById(SEMANTIC_IDS["bg/primary"])
  ),
];

function swatchRow(label, ids) {
  const row = figma.createFrame();
  row.name = label;
  row.layoutMode = "HORIZONTAL";
  row.itemSpacing = 8;
  row.fills = [];
  row.resize(592, 48);
  for (const [name, id] of Object.entries(ids)) {
    const s = figma.createFrame();
    s.name = name;
    s.resize(48, 48);
    s.fills = [
      figma.variables.setBoundVariableForPaint(
        { type: "SOLID", color: { r: 0, g: 0, b: 0 } },
        "color",
        figma.variables.getVariableById(id)
      ),
    ];
    row.appendChild(s);
  }
  return row;
}

frame.appendChild(swatchRow("Semantic", SEMANTIC_IDS));
frame.appendChild(swatchRow("Step", STEP_IDS));

figma.currentPage.appendChild(frame);
figma.viewport.scrollAndZoomIntoView([frame]);

return { frameId: frame.id };
```

- [ ] **Step 3: Verify visually**

Use `mcp__pencil__get_screenshot` is NOT applicable (Pencil tool is for `.pen` files). Instead, open the Figma file URL captured in Task 1 and visually confirm:
- Frame background renders `bg/primary` (`#050709`)
- 8 semantic swatches + 6 step swatches present
- Each swatch's fill resolves through its variable (right-click → "Detach variable" should show the aliased token)

- [ ] **Step 4: Commit**

```bash
# No code changed; record completion in the spec.
git add docs/superpowers/specs/2026-05-22-design-system-tokens-figma-sync-design.md
git commit -m "design-system: complete token sync pass 1 (verification frame in Figma)"
```

---

## Wrap-up

### Task 8: Final report to user

**Files:** none

- [ ] **Step 1: Report**

In conversation, share:
- Figma file URL
- Variable counts per collection (13 / 8 / 6 / 5 / 11)
- Link to the spec and this plan
- Note that the next pass (components) is gated on user approval — do NOT start it
