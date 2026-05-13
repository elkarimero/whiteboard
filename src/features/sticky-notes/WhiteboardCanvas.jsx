import { useEffect, useRef, useState } from 'react'
import StickyNote from './StickyNote'
import styles from './WhiteboardCanvas.module.css'

const MIN_ZOOM = 0.3
const MAX_ZOOM = 3.0

export default function WhiteboardCanvas({ notes, dispatch }) {
  const [viewport, setViewport] = useState({ zoom: 1, panX: 0, panY: 0 })
  const canvasRef = useRef(null)
  const worldRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function handleWheel(e) {
      e.preventDefault()

      setViewport(({ zoom, panX, panY }) => {
        const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1
        const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * factor))
        const mouseX = e.clientX
        const mouseY = e.clientY
        const newPanX = mouseX - (mouseX - panX) * (newZoom / zoom)
        const newPanY = mouseY - (mouseY - panY) * (newZoom / zoom)
        return { zoom: newZoom, panX: newPanX, panY: newPanY }
      })
    }

    canvas.addEventListener('wheel', handleWheel, { passive: false })
    return () => canvas.removeEventListener('wheel', handleWheel)
  }, [])

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

  // Bug #3 fix — StickyNote calls stopPropagation, so any click that reaches
  // this handler comes from empty canvas space (outer div or world div).
  function handleClick() {
    dispatch({ type: 'DESELECT_ALL' })
  }

  useEffect(() => {
    function handleKeyDown(e) {
      // Bug #1 fix — do not delete a note while the user is editing its text
      if (document.activeElement?.isContentEditable) return
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
      <div
        ref={worldRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transformOrigin: '0 0',
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
        }}
      >
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
