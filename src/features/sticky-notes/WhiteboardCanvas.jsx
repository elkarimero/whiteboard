import { useEffect } from 'react'
import StickyNote from './StickyNote'
import styles from './WhiteboardCanvas.module.css'

export default function WhiteboardCanvas({ notes, dispatch }) {
  function handleDoubleClick(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    dispatch({
      type: 'ADD_NOTE',
      payload: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
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

  return (
    <div
      className={styles.canvas}
      data-testid="canvas"
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
    >
      {notes.map((note) => (
        <StickyNote key={note.id} note={note} dispatch={dispatch} />
      ))}
    </div>
  )
}
