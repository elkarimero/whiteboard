## Why

Le whiteboard n'a pas encore de moyen d'annoter le canvas.

## What Changes

- Créer / éditer / déplacer / supprimer des notes

## Capabilities

### New Capabilities
- `sticky-notes`: gestion des sticky notes sur le canvas

### Modified Capabilities
*(aucune)*

## Non-goals

- Persistance des notes (pas de localStorage)
- Redimensionnement des notes
- Undo/redo

## Impact

Nouveau dossier `src/features/sticky-notes/`, modification de `App.jsx`