## Why

The whiteboard is currently limited to the screen viewport — users cannot zoom out
to see the big picture or zoom in to work on details. A scroll-wheel zoom centered
on the mouse cursor is the standard interaction model for canvas-based tools.

## What Changes

- Add scroll-wheel zoom on the whiteboard canvas (30% to 300%)
- Center the zoom on the mouse cursor position
- Correct note creation and drag coordinates to account for zoom and pan

## Capabilities

### New Capabilities
- `canvas-zoom`: scroll-wheel zoom with mouse-centered pan on the whiteboard

### Modified Capabilities
*(none)*

## Non-goals

- Zoom buttons (+/-) in the UI
- Visually stable grid (grid scales with the canvas)
- Undo/redo of zoom or pan actions
- Manual pan by dragging the canvas background
- Pinch-to-zoom (touch support)

## Impact

- `WhiteboardCanvas.jsx`: add `onWheel` handler, `zoom`/`panX`/`panY` state, apply CSS transform
- `WhiteboardCanvas.jsx`: correct `ADD_NOTE` coordinates for zoom/pan
- `StickyNote.jsx`: correct drag coordinates for zoom/pan
