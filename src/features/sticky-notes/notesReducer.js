/**
 * @param {import('./types').Note[]} state
 * @param {{ type: string, payload: any }} action
 * @returns {import('./types').Note[]}
 */
export function notesReducer(state, action) {
  switch (action.type) {
    case 'ADD_NOTE':
      return [
        ...state,
        {
          id: crypto.randomUUID(),
          x: action.payload.x,
          y: action.payload.y,
          text: '',
          selected: false,
        },
      ]

    case 'DELETE_NOTE':
      return state.filter((note) => note.id !== action.payload.id)

    case 'MOVE_NOTE':
      return state.map((note) =>
        note.id === action.payload.id
          ? { ...note , x: action.payload.x, y: action.payload.y }
          : note
      )

    case 'SELECT_NOTE':
      return state.map((note) => ({
        ...note,
        selected: note.id === action.payload.id,
      }))

    case 'DESELECT_ALL':
      return state.map((note) => ({ ...note, selected: false }))

    case 'UPDATE_TEXT':
      return state.map((note) =>
        note.id === action.payload.id
          ? { ...note, text: action.payload.text }
          : note
      )

    default:
      return state
  }
}
