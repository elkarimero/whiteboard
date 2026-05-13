## Why

pas de filet de sécurité contre les régressions sur les interactions utilisateur 

## What Changes

- ajout de tests E2E Playwright couvrant les scénarios de la spec sticky-notes

## Capabilities

### New Capabilities
- `sticky-notes-e2e`: tests les interactions utilisateur décrites dans la spec sticky-notes

### Modified Capabilities
*(aucune)*

## Non-goals

- tests unitaires
- tests de performance
- CI/CD pipeline

## Impact

- nouveau dossier e2e/
- ajout de Playwright comme devDependency