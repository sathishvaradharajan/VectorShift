# VectorShift Frontend Technical Assessment — Implementation Guide

## How to Run

### Frontend
```bash
cd frontend
npm i
npm start        # runs at http://localhost:3000
```

### Backend
```bash
cd backend
pip install fastapi uvicorn pydantic
uvicorn main:app --reload   # runs at http://localhost:8000
```

---

## Project Structure

```
frontend/src/
├── App.js                  # Root layout (toolbar + canvas + submit bar)
├── index.css               # Global dark theme + ReactFlow overrides
├── ui.js                   # ReactFlow canvas, drag-drop, node registry
├── toolbar.js              # Draggable node palette
├── draggableNode.js        # Single draggable toolbar chip
├── store.js                # Zustand global state (nodes, edges, CRUD)
├── submit.js               # Submit button + POST to backend
└── nodes/
    ├── BaseNode.js         # ★ Shared node abstraction
    ├── inputNode.js        # Original node (refactored onto BaseNode)
    ├── outputNode.js       # Original node (refactored onto BaseNode)
    ├── llmNode.js          # Original node (refactored onto BaseNode)
    ├── textNode.js         # Part 3 — dynamic resize + variable handles
    ├── filterNode.js       # New node (pass/fail routing)
    ├── apiNode.js          # New node (HTTP API call)
    ├── transformNode.js    # New node (string/data transform)
    ├── noteNode.js         # New node (annotation, no handles)
    └── mergeNode.js        # New node (join two inputs)
backend/
└── main.py                 # FastAPI — /pipelines/parse + DAG check
```

---

## Part 1 — Node Abstraction

### The Problem
Every node was a copy-paste of the same structure: a `<div>` container, a title, a body, and some `<Handle>` elements. Adding a new node meant repeating ~40 lines of layout boilerplate.

### The Solution — `BaseNode.js`
`BaseNode` accepts a declarative config:

```js
<BaseNode
  id={id}
  title="My Node"
  headerColor="linear-gradient(90deg, #22c55e, #4ade80)"
  handles={[
    { type: 'target', position: 'left',  id: `${id}-input` },
    { type: 'source', position: 'right', id: `${id}-output`, label: 'result' },
  ]}
>
  {/* your node-specific fields here */}
</BaseNode>
```

**Key props:**
| Prop | Type | Purpose |
|---|---|---|
| `title` | string | Header text |
| `headerColor` | CSS string | Gradient for the header bar |
| `handles` | Handle[] | Declarative list of ReactFlow handles |
| `children` | ReactNode | Node-specific form fields |
| `style` | object | Override outer container style |

**Handle config shape:**
```js
{
  type: 'source' | 'target',
  position: 'left' | 'right' | 'top' | 'bottom',
  id: string,          // must be unique on the node
  label?: string,      // renders a small label near the handle
  style?: object,      // override handle position (e.g. top: '33%')
}
```

### Important Things to Study
- **ReactFlow `Handle`** — must have a unique `id` per node. `type="source"` means output; `type="target"` means input.
- **ReactFlow `Position`** enum — `Position.Left`, `Position.Right`, etc.
- **Composition pattern** — `BaseNode` uses `children` prop so each node keeps its own state and fields.

### The 5 New Nodes

| Node | File | Handles | Purpose |
|---|---|---|---|
| Filter | `filterNode.js` | 1 in, 2 out (pass/fail) | Conditional routing based on a condition string |
| API Call | `apiNode.js` | 2 in (body, headers), 1 out | Configure an HTTP request |
| Transform | `transformNode.js` | 1 in, 1 out | Pick a string/data operation (Uppercase, JSON Parse, etc.) |
| Note | `noteNode.js` | None | Annotation / comment on the canvas |
| Merge | `mergeNode.js` | 2 in (A, B), 1 out | Join two streams with a configurable separator |

---

## Part 2 — Styling

### Design System
- **Color palette:** Catppuccin Mocha-inspired dark theme
  - Background: `#0f0f1a` / `#1e1e2e` / `#2a2a3e`
  - Borders: `#4a4a6a`
  - Accent: `#6c63ff` / `#a78bfa` (purple)
  - Text: `#e2e8f0` / `#94a3b8` (muted)

- **Each node type has its own header gradient** (green=Input, amber=Output, purple=LLM, cyan=Text, red=Filter, sky=API, amber=Transform, slate=Note, violet=Merge)

### What Was Styled
- `index.css` — global reset, font import (Inter), ReactFlow edge/control overrides
- `BaseNode.js` — card shell: rounded corners, gradient background, drop shadow
- `toolbar.js` — dark top bar with brand name + node chips
- `draggableNode.js` — chips with per-node accent color border + glow
- `submit.js` — centered purple gradient submit button with hover scale
- `ui.js` — full-viewport canvas, dark MiniMap/Controls, fixed typo (`100wv` → `100vw`)

### Important Things to Study
- **ReactFlow CSS classes** — override them in a global CSS file (`.react-flow__edge-path`, `.react-flow__controls`, etc.)
- **CSS-in-JS inline styles** — React style prop takes camelCase (`borderRadius`, not `border-radius`)
- **`linear-gradient` syntax** — `linear-gradient(direction, color1, color2)`

---

## Part 3 — Text Node Logic

### Feature 1: Dynamic Resize
The textarea auto-expands vertically as text grows:

```js
useEffect(() => {
  if (textareaRef.current) {
    textareaRef.current.style.height = 'auto';          // reset
    textareaRef.current.style.height =
      textareaRef.current.scrollHeight + 'px';          // expand to content
  }
}, [currText]);
```

### Feature 2: Variable Handles
Variables are extracted with a regex:
```js
const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;
```

- Matches `{{ input }}`, `{{myVar}}`, `{{ some_name_123 }}`
- Does NOT match `{{ 123bad }}` (must start with letter/underscore — valid JS identifier)
- Duplicates are de-duped
- Each unique variable gets a dynamic `<Handle type="target">` on the left side
- Handle vertical positions are evenly distributed: `top = ((i+1) / (count+1)) * 100%`

### Important Things to Study
- **`useRef` + `scrollHeight`** — the pattern for auto-resizing textareas
- **`useEffect` dependencies** — re-run the resize whenever `currText` changes
- **Regular expressions with exec() — extracting variables from text
- **Dynamic ReactFlow handles** — you can render as many `<Handle>` elements as you want; ReactFlow tracks them by `id`

---

## Part 4 — Backend Integration

### Frontend (`submit.js`)
Reads nodes + edges from Zustand store, POSTs them as JSON:

```js
const response = await fetch('http://localhost:8000/pipelines/parse', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nodes, edges }),
});
const { num_nodes, num_edges, is_dag } = await response.json();
alert(`Nodes: ${num_nodes}\nEdges: ${num_edges}\nIs DAG: ${is_dag ? 'Yes' : 'No'}`);
```

### Backend (`main.py`)

**CORS** must be enabled — browser blocks cross-origin requests by default:
```python
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], ...)
```

**DAG check — Kahn's Algorithm (topological sort):**
1. Build adjacency list and in-degree map from edges
2. Start a queue with all nodes that have in-degree 0 (no incoming edges)
3. Process queue: decrement neighbors' in-degrees; enqueue those that reach 0
4. If total visited == total nodes → no cycle → it IS a DAG

```python
def is_dag(nodes, edges) -> bool:
    node_ids = {n['id'] for n in nodes}
    adj = {nid: [] for nid in node_ids}
    in_degree = dict.fromkeys(node_ids, 0)
    for edge in edges:
        adj[edge['source']].append(edge['target'])
        in_degree[edge['target']] += 1
    queue = [nid for nid, deg in in_degree.items() if deg == 0]
    visited = 0
    while queue:
        node = queue.pop()
        visited += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    return visited == len(node_ids)
```

**Endpoint changed from `GET` to `POST`** because it receives a JSON body.

### Important Things to Study
- **CORS (Cross-Origin Resource Sharing)** — why it exists, and how FastAPI's `CORSMiddleware` solves it
- **Pydantic `BaseModel`** — FastAPI uses it to validate + parse the JSON request body automatically
- **Kahn's Algorithm** — a classic graph algorithm; time complexity O(V + E)
- **DAG definition** — a directed graph with no cycles; used in task scheduling, build systems, and AI pipelines
- **`fetch` API** — browser-native HTTP client; `async/await` makes it readable
- **Zustand `useStore` with selector** — how to read specific slices of state without re-rendering on unrelated changes

---

## Key Concepts Summary

| Concept | Where Used | Why Important |
|---|---|---|
| ReactFlow Handles | All nodes | Connect nodes to form a pipeline graph |
| Zustand store | `store.js`, all nodes, `submit.js` | Single source of truth for all node/edge state |
| Abstraction / composition | `BaseNode.js` | DRY principle — change style once, affects all nodes |
| `useRef` + `scrollHeight` | `textNode.js` | DOM measurement for auto-resize |
| Regex with global flag | `textNode.js` | Extract all variable occurrences |
| Kahn's algorithm | `main.py` | Cycle detection in directed graphs |
| CORS middleware | `main.py` | Allow browser to talk to local API |
| Pydantic models | `main.py` | Request validation and type safety |
| CSS-in-JS | All components | Scoped, dynamic styles without class name collisions |
| `async/await` + `fetch` | `submit.js` | Non-blocking HTTP requests in the browser |

---

## Common Pitfalls & Notes

1. **`100wv` typo in original `ui.js`** — was `width: '100wv'` (invalid), fixed to `'100vw'`
2. **ReactFlow `Handle` id uniqueness** — two handles on the same node with the same id will silently break connections
3. **CORS must include the exact origin** — `http://localhost:3000` not `localhost:3000`
4. **Textarea `resize: none` + overflow hidden** — required for the auto-height trick to work cleanly
5. **Backend endpoint is POST not GET** — the original stub used `GET` with `Form(...)`, which won't accept a JSON body
6. **`nodeIDs` state in store** — the store tracks per-type counters to generate stable IDs like `text-1`, `text-2`
7. **ReactFlow `fitView`** — added to `ui.js` so the canvas auto-centers on load
