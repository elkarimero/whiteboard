# Code Review — feat/add-canvas-zoom

**Reviewer:** AI agent  
**Branch:** `feat/add-canvas-zoom` → `feat/add-sticky-notes`  
**Files reviewed:**
- `src/features/sticky-notes/WhiteboardCanvas.jsx`
- `src/features/sticky-notes/StickyNote.jsx`  
**Specs reviewed:**
- `openspec/changes/add-canvas-zoom/specs/canvas-zoom/spec.md`
- `openspec/changes/add-canvas-zoom/design.md`

---

## Section A — Conformité aux specs

### Requirement: User can zoom in/out with the scroll wheel

✅ **Conforme.**  
`deltaY < 0` → factor `1.1` (zoom in), sinon factor `1/1.1` (zoom out).  
La direction est correcte pour les souris et trackpads sur macOS.

```js
// WhiteboardCanvas.jsx
const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1
const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * factor))
```

### Requirement: Zoom is bounded between 30% and 300%

✅ **Conforme.**  
`Math.min(3.0, Math.max(0.3, zoom * factor))` clampe correctement aux deux bornes.  
Les constantes `MIN_ZOOM = 0.3` et `MAX_ZOOM = 3.0` sont bien définies en haut du fichier.

### Requirement: Zoom is centered on the mouse cursor position

✅ **Conforme.**  
La formule implémentée correspond exactement à celle définie dans `design.md` :

```js
const newPanX = mouseX - (mouseX - panX) * (newZoom / zoom)
const newPanY = mouseY - (mouseY - panY) * (newZoom / zoom)
```

La mise à jour via la forme fonctionnelle de `setViewport(prev => ...)` est également correcte — elle évite le problème de closure périmée dans le handler `wheel`.

### Requirement: Note creation is accurate at any zoom level

✅ **Conforme.**  
La correction de coordonnées dans `handleDoubleClick` est juste :

```js
x: (e.clientX - rect.left - panX) / zoom,
y: (e.clientY - rect.top - panY) / zoom,
```

L'utilisation de `getBoundingClientRect()` est une bonne pratique qui fonctionne même si le canvas n'est pas positionné à `(0, 0)` dans la page.

### Requirement: Note dragging is accurate at any zoom level

⚠️ **Conforme, avec une réserve (voir Bug #2).**  
La formule de drag est correcte :

```js
// handleMouseDown (dragOffset)
x: (e.clientX - panX) / zoom - note.x

// onMouseMove (position)
x: (e.clientX - panX) / zoom - dragOffset.current.x
```

Mais `panX`, `panY`, `zoom` sont capturés dans la closure au moment du `mouseDown` et ne se mettront pas à jour si le viewport change pendant le drag (voir Bug #2).

---

## Section B — Qualité du code React

### Bug #1 — ÉLEVÉ : La touche Backspace supprime une note pendant l'édition

**Fichier :** `WhiteboardCanvas.jsx`  
**Gravité :** Élevée — régression fonctionnelle

Le handler `keydown` sur `window` réagit à `Backspace` en plus de `Delete` :

```js
if (e.key === 'Delete' || e.key === 'Backspace') {
  const selected = notes.find((n) => n.selected)
  if (selected) {
    dispatch({ type: 'DELETE_NOTE', payload: { id: selected.id } })
  }
}
```

**Problème :** quand l'utilisateur double-clique sur une note pour l'éditer, la note est sélectionnée (le premier `click` déclenche `SELECT_NOTE`). Si l'utilisateur appuie sur `Backspace` pour effacer du texte, le handler se déclenche également et **supprime la note entière**.

**Correction suggérée :**

```js
function handleKeyDown(e) {
  // Ne pas supprimer la note si un élément contentEditable est actif
  if (document.activeElement?.isContentEditable) return
  if (e.key === 'Delete' || e.key === 'Backspace') {
    // ...
  }
}
```

Ou, plus simplement, ne réagir qu'à la touche `Delete` (qui ne sert pas à l'édition de texte).

---

### Bug #2 — MOYEN : Closure périmée dans le handler de drag

**Fichier :** `StickyNote.jsx`  
**Gravité :** Moyenne — rare en pratique, mais incorrecte architecturalement

La fonction `onMouseMove` (attachée à `window`) capture `panX`, `panY` et `zoom` depuis les props au moment du `mouseDown`. Si le viewport change pendant le drag (improbable mais possible), la position calculée sera incorrecte.

```js
function handleMouseDown(e) {
  // panX, panY, zoom sont capturés ici — snapshot figé
  dragOffset.current = {
    x: (e.clientX - panX) / zoom - note.x,
  }

  function onMouseMove(e) {
    // Ces valeurs ne reflètent pas un éventuel changement de viewport
    x: (e.clientX - panX) / zoom - dragOffset.current.x,
  }
}
```

**Correction suggérée :** Stocker le zoom et le pan dans le `dragOffset.current` au moment du `mouseDown` et les réutiliser dans `onMouseMove`, ce qui est déjà le cas implicitement. Le vrai fix serait d'utiliser une `ref` pour accéder aux valeurs courantes du viewport :

```js
// Dans WhiteboardCanvas, passer une ref du viewport plutôt que des valeurs
const viewportRef = useRef(viewport)
useEffect(() => { viewportRef.current = viewport }, [viewport])
// ... passer viewportRef à StickyNote
```

---

### Bug #3 — MOYEN : DESELECT_ALL potentiellement cassé après introduction du div world

**Fichier :** `WhiteboardCanvas.jsx`  
**Gravité :** Moyenne — régression introduite par le zoom

Avant le zoom, le canvas était :
```jsx
<div className={styles.canvas} onClick={handleClick}>
  <StickyNote /> {/* direct child */}
</div>
```

Après le zoom, un div intermédiaire a été ajouté :
```jsx
<div className={styles.canvas} onClick={handleClick}> {/* canvasRef */}
  <div style={{ transform: ... }}> {/* world div — pas de onClick */}
    <StickyNote />
  </div>
</div>
```

La condition de `handleClick` est :
```js
if (e.target === e.currentTarget) { dispatch({ type: 'DESELECT_ALL' }) }
```

Si l'utilisateur clique sur de l'espace vide **à l'intérieur** du `div` world (transformé), `e.target` sera le `div` world et non le canvas — `DESELECT_ALL` ne se déclenchera pas.

**Correction suggérée :** Retirer la condition `e.target === e.currentTarget` ou cibler le `div` world spécifiquement, et supprimer la propagation dans les `StickyNote` :

```js
function handleClick(e) {
  // Déclencher DESELECT_ALL sur n'importe quel clic dans le canvas
  // (les notes appellent déjà stopPropagation)
  dispatch({ type: 'DESELECT_ALL' })
}
```

---

### Observation #4 — FAIBLE : Commentaires de développement à supprimer

**Fichier :** `WhiteboardCanvas.jsx`, `StickyNote.jsx`  
**Gravité :** Cosmétique

Les commentaires `// Task 1.1`, `// Task 2.3`, etc. sont des artefacts du workflow de développement et ne doivent pas rester en production. Ils n'apportent aucune information au lecteur du code.

---

### Observation #5 — FAIBLE : useEffect keydown re-souscrit à chaque changement de notes

**Fichier :** `WhiteboardCanvas.jsx`  
**Gravité :** Faible — impact performance mineur

```js
useEffect(() => {
  // ...
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [notes, dispatch]) // ← re-attache à chaque modification de notes
```

L'event listener est recréé à chaque ajout / suppression / déplacement de note parce que `notes` est dans les dépendances. C'est fonctionnellement correct mais légèrement inefficace.

**Alternative plus robuste :** utiliser une ref pour accéder à `notes` sans l'ajouter aux dépendances :

```js
const notesRef = useRef(notes)
useEffect(() => { notesRef.current = notes }, [notes])

useEffect(() => {
  function handleKeyDown(e) {
    const selected = notesRef.current.find((n) => n.selected)
    // ...
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [dispatch]) // dispatch est stable
```

---

### Observation #6 — CONFORME AUX DÉCISIONS DU DESIGN : `passive: false` via addEventListener

✅ La décision d'attacher le handler `wheel` via `addEventListener` avec `{ passive: false }` (plutôt que `onWheel` React) est correcte et correspond à la décision D4 du `design.md`. React attache ses événements synthétiques en mode passif par défaut dans les versions récentes, ce qui empêche `e.preventDefault()` de fonctionner. L'implémentation est donc robuste.

---

## Résumé

| # | Sévérité | Fichier | Résumé |
|---|----------|---------|--------|
| Bug #1 | Élevée | `WhiteboardCanvas.jsx` | Backspace supprime la note pendant l'édition |
| Bug #2 | Moyenne | `StickyNote.jsx` | Closure périmée sur viewport dans le drag |
| Bug #3 | Moyenne | `WhiteboardCanvas.jsx` | DESELECT_ALL cassé avec le div world intermédiaire |
| Obs #4 | Faible | Les deux fichiers | Commentaires "Task X.X" à supprimer |
| Obs #5 | Faible | `WhiteboardCanvas.jsx` | useEffect keydown re-souscrit trop souvent |

**Score de conformité aux specs :** 5/5 requirements couverts  
**Code à corriger avant merge :** Bug #1 (bloquant) et Bug #3 (bloquant)
