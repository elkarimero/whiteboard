## 1. Viewport state

- [x] 1.1 Ajouter `useState({ zoom: 1, panX: 0, panY: 0 })` dans `WhiteboardCanvas.jsx`
- [x] 1.2 Appliquer `transform: translate(panX px, panY px) scale(zoom)` avec `transform-origin: 0 0` sur le `div` canvas

## 2. Zoom au scroll

- [x] 2.1 Attacher un `addEventListener('wheel', handler, { passive: false })` sur le canvas via `useEffect`
- [x] 2.2 Calculer `newZoom = clamp(zoom * factor, 0.3, 3.0)` à chaque événement wheel
- [x] 2.3 Calculer `newPanX` et `newPanY` avec la formule de centrage souris : `mouseX - (mouseX - panX) * (newZoom / zoom)`
- [x] 2.4 Appeler `e.preventDefault()` dans le handler pour bloquer le scroll natif de la page

## 3. Correction des coordonnées

- [x] 3.1 Corriger `ADD_NOTE` dans `handleDoubleClick` : `x = (clientX - rect.left - panX) / zoom`
- [x] 3.2 Corriger le calcul de `dragOffset` dans `StickyNote.jsx` `handleMouseDown` : `x = (clientX - panX) / zoom - note.x`
- [x] 3.3 Corriger le calcul de position pendant le drag `onMouseMove` : `x = (clientX - panX) / zoom - offsetX`

## 4. Passer zoom/pan au composant StickyNote

- [x] 4.1 Passer `zoom`, `panX`, `panY` en props de `WhiteboardCanvas` vers `StickyNote`
