## 1. Scaffolding projet

- [x] 1.1 Initialiser le projet React avec Vite (`npm create vite@latest . -- --template react`)
- [x] 1.2 Supprimer le boilerplate Vite (CSS par défaut, logo, composant counter)
- [x] 1.3 Créer la structure de dossiers `src/features/sticky-notes/`

## 2. Modèle de données et reducer

- [x] 2.1 Définir le type d'une note dans `src/features/sticky-notes/types.js` (id, x, y, text, selected)
- [x] 2.2 Implémenter `notesReducer` avec les actions `ADD_NOTE` et `DELETE_NOTE`
- [x] 2.3 Ajouter les actions `MOVE_NOTE`, `SELECT_NOTE` et `UPDATE_TEXT` au reducer

## 3. Composant WhiteboardCanvas

- [x] 3.1 Créer `src/features/sticky-notes/WhiteboardCanvas.jsx` — div plein écran avec `position: relative`
- [x] 3.2 Brancher `onDoubleClick` pour dispatcher `ADD_NOTE` aux coordonnées du clic

## 4. Composant StickyNote — interactions

- [x] 4.1 Créer `src/features/sticky-notes/StickyNote.jsx` positionné en absolu via `left: x, top: y`
- [x] 4.2 Implémenter le double-clic pour entrer en mode édition (`contentEditable`) avec `stopPropagation`
- [x] 4.3 Implémenter la sortie du mode édition au `onBlur` et dispatcher `UPDATE_TEXT`
- [x] 4.4 Implémenter le clic simple pour dispatcher `SELECT_NOTE`
- [x] 4.5 Implémenter le drag avec `onMouseDown/Move/Up`, désactivé si `isEditing`
- [x] 4.6 Ajouter le bouton de suppression (×) qui dispatche `DELETE_NOTE` au clic
- [x] 4.7 Gérer la touche `Suppr` au niveau du canvas pour supprimer la note sélectionnée

## 5. Wiring et styling

- [x] 5.1 Brancher `useReducer` dans `App.jsx` et rendre `WhiteboardCanvas` avec les notes en props
- [x] 5.2 Styler la note (fond jaune, ombre, taille fixe 200×150px) en CSS Module
- [x] 5.3 Styler l'indicateur de sélection (bordure visible) et le bouton × (coin haut-droit, visible au hover)
