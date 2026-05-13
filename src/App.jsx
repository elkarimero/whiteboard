import { useReducer } from 'react'
import WhiteboardCanvas from './features/sticky-notes/WhiteboardCanvas'
import { notesReducer } from './features/sticky-notes/notesReducer'

export default function App() {
  const [notes, dispatch] = useReducer(notesReducer, [])

  return <WhiteboardCanvas notes={notes} dispatch={dispatch} />
}
