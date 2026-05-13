## Context

Les sticky notes sont implémentées mais aucun test automatisé ne couvre les
interactions utilisateur. Une régression sur le drag, la suppression ou le mode
édition pourrait passer inaperçue. Ce design décrit comment mettre en place
une suite de tests E2E avec Playwright pour couvrir les scénarios définis dans
la spec `sticky-notes`.

## Goals / Non-Goals

**Goals:**
- Mettre en place Playwright comme outil de test E2E
- Couvrir tous les scénarios de la spec `sticky-notes` via des tests automatisés
- Permettre de lancer les tests sans configuration manuelle (serveur de dev automatique)

**Non-Goals:**
- Tests unitaires du reducer ou des composants isolés
- Tests de performance ou de charge
- Intégration CI/CD (GitHub Actions, etc.)

## Decisions

### 1. Playwright comme outil E2E

Playwright permet de tester l'application dans un vrai navigateur avec des
interactions souris et clavier natives — indispensable pour valider le drag,
le double-clic et les événements clavier (touche Suppr).

**Alternatif considéré :** Cypress — API similaire mais moins bien intégré avec
Vite et TypeScript sans configuration supplémentaire.

### 2. `data-testid` plutôt que sélecteurs CSS

Les composants utilisent CSS Modules, qui transforme les noms de classes en
identifiants hachés (`note` → `_note_abc123`). Les sélecteurs CSS sont donc
instables entre les builds.

Les attributs `data-testid` sont stables, indépendants du styling, et
communiquent clairement l'intention de test dans le code source.

**Attributs ajoutés :**

| Élément | `data-testid` |
|---|---|
| `WhiteboardCanvas` | `canvas` |
| `StickyNote` | `sticky-note` |
| Bouton de suppression | `delete-btn` |
| Zone de texte | `note-text` |

`data-selected` est également ajouté sur `StickyNote` pour tester l'état
de sélection sans dépendre du CSS.

### 3. `webServer` dans `playwright.config.ts`

Playwright démarre automatiquement `npm run dev` avant les tests via l'option
`webServer`, et le réutilise si un serveur tourne déjà (`reuseExistingServer: true`).
Cela évite de devoir lancer le serveur manuellement dans un terminal séparé.

### 4. Chromium uniquement

Seul Chromium est installé (les autres navigateurs n'ont pas pu être téléchargés
en raison d'un proxy SSL d'entreprise). La suite tourne sur Chromium uniquement
pour l'instant — Firefox et WebKit pourront être ajoutés si l'environnement le permet.

## Risks / Trade-offs

- **Flakiness du drag** : le test de drag and drop est sensible au timing.
  Playwright gère l'attente automatiquement mais des délais réseau ou de rendu
  peuvent provoquer des faux négatifs.
  → Mitigation : utiliser `dragTo` de Playwright plutôt que des événements bas niveau.

- **`data-testid` en production** : les attributs `data-testid` sont visibles
  dans le HTML de production. Ce n'est pas un risque de sécurité mais certaines
  équipes préfèrent les supprimer en build prod.
  → Acceptable pour ce projet solo ; peut être configuré via Vite si nécessaire.
