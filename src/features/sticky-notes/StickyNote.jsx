import { useRef, useState } from 'react'
import styles from './StickyNote.module.css'

export default function StickyNote({ note, dispatch, zoom, panX, panY }) {
  const [isEditing, setIsEditing] = useState(false)
  const dragOffset = useRef(null)
  const textRef = useRef(null)

  function handleClick(e) {
    e.stopPropagation()
    dispatch({ type: 'SELECT_NOTE', payload: { id: note.id } })
  }

  function handleDoubleClick(e) {
    e.stopPropagation()
    setIsEditing(true)
    setTimeout(() => textRef.current?.focus(), 0)
  }

  function handleBlur() {
    setIsEditing(false)
    dispatch({
      type: 'UPDATE_TEXT',
      payload: { id: note.id, text: textRef.current?.innerText ?? '' },
    })
  }

  function handleMouseDown(e) {
    if (isEditing) return
    e.preventDefault()
    // Task 3.2 — dragOffset in world coordinates
    dragOffset.current = {
      x: (e.clientX - panX) / zoom - note.x,
      y: (e.clientY - panY) / zoom - note.y,
    }

    function onMouseMove(e) {
      // Task 3.3 — position in world coordinates during drag
      dispatch({
        type: 'MOVE_NOTE',
        payload: {
          id: note.id,
          x: (e.clientX - panX) / zoom - dragOffset.current.x,
          y: (e.clientY - panY) / zoom - dragOffset.current.y,
        },
      })
    }

    function onMouseUp() {
      dragOffset.current = null
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  function handleDelete(e) {
    e.stopPropagation()
    dispatch({ type: 'DELETE_NOTE', payload: { id: note.id } })
  }

  return (
    <div
      className={`${styles.note} ${note.selected ? styles.selected : ''}`}
      style={{ left: note.x, top: note.y }}
      data-testid="sticky-note"
      data-selected={note.selected}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
    >
      <button className={styles.deleteBtn} data-testid="delete-btn" onClick={handleDelete}>×</button>
      <div
        ref={textRef}
        className={styles.text}
        data-testid="note-text"
        contentEditable={isEditing}
        suppressContentEditableWarning
        onBlur={handleBlur}
      >
        {note.text}
      </div>
    </div>
  )
}
