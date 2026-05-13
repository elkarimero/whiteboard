## Context

The whiteboard canvas is currently a `div` with `position: relative` and notes
positioned absolutely using pixel coordinates stored in state (`note.x`, `note.y`).
There is no concept of zoom or pan. Mouse coordinates are taken directly from
`clientX`/`clientY` without correction.

## Goals / Non-Goals

**Goals:**
- Enable scroll-wheel zoom from 30% to 300%
- Center the zoom on the mouse cursor position
- Keep note creation and drag interactions accurate at any zoom level

**Non-Goals:**
- Visually stable grid (grid scales with the canvas)
- Zoom buttons in the UI
- Undo/redo of zoom/pan
- Manual pan by dragging the background
- Pinch-to-zoom (touch)

## Decisions

### 1. CSS `transform: scale(zoom)` on the canvas — not logical coordinates

The canvas `div` is scaled using `transform: translate(panX, panY) scale(zoom)`
with `transform-origin: 0 0`. Notes keep their absolute pixel positions in state
unchanged — they are visually scaled by the CSS transform.

**Alternative considered:** a logical coordinate system where `note.x`/`note.y`
are world coordinates, converted to pixels at render time. More correct
architecturally but requires a larger refactor of all coordinate handling.
CSS transform is sufficient for this scope.

### 2. `zoom`, `panX`, `panY` live in `useState` inside `WhiteboardCanvas`

Viewport state (how you look at the document) is separated from document state
(the notes). This avoids re-rendering all sticky notes on every wheel event.

```
App
└── useReducer → notes[]          ← document state
└── WhiteboardCanvas
    └── useState → zoom, panX, panY  ← viewport state
        └── StickyNote[]
```

**Alternative considered:** adding zoom/pan to `notesReducer`. Rejected because
wheel events fire at high frequency and would trigger unnecessary note re-renders.
It also mixes concerns (content vs view).

### 3. Mouse-centered zoom via pan compensation

On each wheel event, `panX` and `panY` are adjusted so the point under the
cursor stays fixed after the scale change:

```
newPanX = mouseX - (mouseX - panX) * (newZoom / oldZoom)
newPanY = mouseY - (mouseY - panY) * (newZoom / oldZoom)
```

`mouseX`/`mouseY` are relative to the viewport (from `e.clientX`, `e.clientY`).

### 4. Coordinate correction for interactions

Any interaction that converts a screen position to a canvas position must
account for the current transform:

```
canvasX = (screenX - panX) / zoom
canvasY = (screenY - panY) / zoom
```

Affected interactions:
- `ADD_NOTE` on double-click (`WhiteboardCanvas.jsx`)
- Drag start offset (`StickyNote.jsx`, `handleMouseDown`)

### Interaction model

```
User scrolls (onWheel on canvas)
  │
  ├── compute newZoom = clamp(oldZoom * factor, 0.3, 3.0)
  ├── compute newPanX, newPanY  (mouse-centered formula)
  └── setViewport({ zoom: newZoom, panX: newPanX, panY: newPanY })
          │
          └── canvas div re-renders with:
              transform: translate(newPanX px, newPanY px) scale(newZoom)
```

### Sequence: zoom in with scroll wheel

```
User         WhiteboardCanvas       React state
  │                                      │
  │──onWheel──▶│                         │
               │── compute newZoom       │
               │── compute newPan        │
               │── setViewport ─────────▶│
               │                   [re-render]
               │◀── new transform ───────│
```

## Risks / Trade-offs

- **Scroll hijacking**: `onWheel` with `e.preventDefault()` blocks native page
  scroll. The canvas must call `preventDefault` to avoid both scrolling and
  zooming simultaneously.
  → Mitigation: attach `onWheel` with `{ passive: false }` via `addEventListener`
  (React's `onWheel` prop does not support `passive: false`).

- **Drag accuracy at extreme zoom**: at 30% zoom, small mouse movements produce
  large canvas movements. At 300%, the reverse. The coordinate correction formula
  handles this correctly but feels different from 100%.
  → Acceptable — this is standard behavior in all canvas tools.

- **Double-click creates note at wrong position without correction**: if
  `ADD_NOTE` still uses raw `clientX - rect.left`, notes appear at the wrong
  place at any zoom level != 100%.
  → Mitigation: apply coordinate correction formula in `handleDoubleClick`.
