import { useEffect, useRef, useState } from 'react'
import StickyNote from './StickyNote'
import styles from './WhiteboardCanvas.module.css'

const MIN_ZOOM = 0.3
const MAX_ZOOM = 3.0

export default function WhiteboardCanvas({ notes, dispatch }) {
  // Task 1.1 — viewport state
  const [viewport, setViewport] = useState({ zoom: 1, panX: 0, panY: 0 })
  const canvasRef = useRef(null)

  // Tasks 2.1-2.4 — scroll-wheel zoom, mouse-centered, passive:false
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function handleWheel(e) {
      e.preventDefault() // Task 2.4 — block native page scroll

      setViewport(({ zoom, panX, panY }) => {
        // Task 2.2 — clamp zoom
        const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1
        const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * factor))

        // Task 2.3 — mouse-centered pan compensation
        const mouseX = e.clientX
        const mouseY = e.clientY
        const newPanX = mouseX - (mouseX - panX) * (newZoom / zoom)
        const newPanY = mouseY - (mouseY - panY) * (newZoom / zoom)

        return { zoom: newZoom, panX: newPanX, panY: newPanY }
      })
    }

    canvas.addEventListener('wheel', handleWheel, { passive: false }) // Task 2.1
    return () => canvas.removeEventListener('wheel', handleWheel)
  }, [])

  // Task 3.1 — corrected ADD_NOTE coordinates
  function handleDoubleClick(e) {
    const { zoom, panX, panY } = viewport
    const rect = e.currentTarget.getBoundingClientRect()
    dispatch({
      type: 'ADD_NOTE',
      payload: {
        x: (e.clientX - rect.left - panX) / zoom,
        y: (e.clientY - rect.top - panY) / zoom,
      },
    })
  }

  function handleClick(e) {
    if (e.target === e.currentTarget) {
      dispatch({ type: 'DESELECT_ALL' })
    }
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selected = notes.find((n) => n.selected)
        if (selected) {
          dispatch({ type: 'DELETE_NOTE', payload: { id: selected.id } })
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [notes, dispatch])

  const { zoom, panX, panY } = viewport

  return (
    <div
      ref={canvasRef}
      className={styles.canvas}
      data-testid="canvas"
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
    >
      {/* Task 1.2 — CSS transform with transform-origin: 0 0 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transformOrigin: '0 0',
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
        }}
      >
        {/* Task 4.1 — pass zoom/panX/panY to StickyNote */}
        {notes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            dispatch={dispatch}
            zoom={zoom}
            panX={panX}
            panY={panY}
          />
        ))}
      </div>
    </div>
  )
}
