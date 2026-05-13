## 1. Setup

- [x] 1.1 Installer Playwright (`npm init playwright@latest`)
- [x] 1.2 Configurer `playwright.config.ts` — Chromium uniquement + `webServer` Vite
- [x] 1.3 Ajouter `data-testid` sur `WhiteboardCanvas`, `StickyNote`, bouton × et zone de texte

## 2. Tests E2E

- [x] 2.1 Écrire le test de création d'une note par double-clic
- [x] 2.2 Écrire le test de sélection d'une note au clic
- [x] 2.3 Écrire le test d'entrée en mode édition par double-clic
- [x] 2.4 Écrire le test de mise à jour du texte et sortie du mode édition
- [x] 2.5 Écrire le test de suppression via la touche Delete
- [x] 2.6 Écrire le test de suppression via le bouton ×
- [x] 2.7 Écrire le test de drag and drop d'une note

## 3. Validation

- [x] 3.1 Lancer `npx playwright test` et vérifier que tous les tests passent