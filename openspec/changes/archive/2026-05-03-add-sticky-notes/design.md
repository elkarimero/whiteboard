## Context

Première feature du projet whiteboard. Il n'y a pas encore de code existant —
l'application React sera scaffoldée avec Vite. Les sticky notes sont le premier
élément interactif du canvas.

## Goals / Non-Goals

**Goals:**
- Définir la structure des composants pour les sticky notes
- Définir le modèle de données et le flux d'état
- Définir le modèle d'interaction (créer, éditer, déplacer, sélectionner, supprimer)

**Non-Goals:**
- Persistance des notes (localStorage ou backend)
- Redimensionnement des notes
- Undo/redo

## Decisions

### 1. Canvas comme un `<div>` positionné, pas `<canvas>` HTML5

Les sticky notes nécessitent de l'édition de texte native (`contentEditable`).
Un élément `<canvas>` HTML5 obligerait à réimplémenter la saisie de texte from scratch.
Un `<div>` conteneur avec `position: relative` permet le positionnement absolu de chaque
note et conserve tous les événements DOM natifs.

**Alternatif considéré :** SVG avec `foreignObject` — plus complexe pour le même résultat.

### 2. État géré avec `useReducer` dans `App.jsx`

La liste des notes est l'état central de l'application. `useReducer` structure les
mutations via des actions explicites (`ADD_NOTE`, `UPDATE_TEXT`, `MOVE_NOTE`,
`SELECT_NOTE`, `DELETE_NOTE`), ce qui facilitera l'ajout futur de features
(undo/redo, multi-select).

**Alternatif considéré :** `useState` avec un tableau — plus simple mais les mutations
complexes (déplacer + désélectionner simultanément) deviennent vite illisibles.

### 3. Drag natif avec événements souris

Le drag est géré via `onMouseDown` / `onMouseMove` / `onMouseUp` directement sur
le composant `StickyNote`. L'offset du clic à l'intérieur de la note est calculé
au `mousedown` pour que la note ne "saute" pas au curseur.

**Alternatif considéré :** `react-draggable` — évité pour ne pas introduire de
dépendance externe sur une feature implémentable nativement.

**Contrainte :** le drag est désactivé quand la note est en mode édition pour ne
pas interférer avec la sélection de texte.

### Structure des composants

```
App
└── WhiteboardCanvas       ← div plein écran, gère le double-clic pour créer
    └── StickyNote[]       ← positionné en absolu, gère édition / drag / suppression
```

**Modèle de données (une note) :**

```js
{
  id: string,        // crypto.randomUUID()
  x: number,        // px du coin haut-gauche depuis le bord gauche du canvas
  y: number,        // px du coin haut-gauche depuis le bord supérieur du canvas
  text: string,
  selected: boolean,
}
```

`x` et `y` représentent le **coin haut-gauche** de la note. Ce choix correspond
directement à `position: absolute; left: x; top: y` en CSS, sans calcul intermédiaire.
Si un snap-to-grid est ajouté plus tard, le coin haut-gauche s'alignera sur les
intersections de la grille — comportement naturel pour des notes posées côte à côte.

## Risks / Trade-offs

- **Conflit double-clic canvas vs note** : double-cliquer sur le canvas crée une note,
  double-cliquer sur une note existante entre en édition. Il faut stopper la propagation
  de l'événement sur la note (`e.stopPropagation()`) pour éviter la création d'une
  deuxième note en dessous.
  → Mitigation : `stopPropagation` sur le `onDoubleClick` du composant `StickyNote`.

- **Drag pendant l'édition** : le `mousemove` global pourrait déplacer une note
  pendant que l'utilisateur sélectionne du texte.
  → Mitigation : un état `isEditing` dans le composant désactive le handler de drag.

- **z-index** : les notes créées en dernier apparaissent par-dessus les anciennes.
  Pas de gestion manuelle du z-order pour ce MVP.
  → Acceptable pour une première itération.
