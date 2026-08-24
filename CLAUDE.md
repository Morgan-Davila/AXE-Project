# CLAUDE.md

Ce fichier fournit des indications à Claude Code (claude.ai/code) pour travailler dans ce dépôt.

## Projet

AXE est une application de productivité personnelle (suivi d'habitudes, statistiques de progression, planification) construite de façon incrémentale en front-end vanilla (sans framework, sans bundler), avec un backend prévu pour une phase ultérieure. Voir README.md pour la roadmap complète (AXE 1 : habitudes, AXE 2 : stats, AXE 3 : agenda, AXE 4 : backend). Le projet en est actuellement à AXE 1 (Habit Manager).

## Commandes

```bash
npm install          # installe les dépendances (sass, chart.js)
npm run sass          # compile src/scss/main.scss -> public/css/style.css une fois
npm run sass:watch    # recompile à chaque modification ; à lancer pendant l'édition de tout fichier .scss
```

Il n'y a ni étape de build ni bundler — `index.html` et `public/pages/*.html` sont ouverts directement comme des fichiers statiques (par ex. via l'extension VS Code "Live Server" sur le port 5501, voir `app.code-workspace`). Il n'existe pas de script npm `dev`, contrairement à ce que laisse penser la section installation du README. Aucune suite de tests n'est configurée (`npm test` est un placeholder qui se termine en erreur).

## Architecture

**Multi-pages, sans routeur.** `index.html` (dashboard) et `public/pages/{habits,schedule,graphs-stats}.html` sont des pages statiques distinctes reliées par de simples liens `<a href>` (voir le header dans `index.html`). Chaque page charge `src/js/main.js` en tant que module ES ; il n'y a pas de point d'entrée par page, donc `main.js` appelle les fonctions d'initialisation de chaque fonctionnalité sans distinction (les recherches DOM renvoient `null` sur les pages où le markup correspondant est absent, et le code en aval est censé vérifier ces `null` via les helpers de `utils/dom.js`).

**Système de debug global (`src/js/debug.js`).** Définit `window.AXE = { DEBUG, VERSION, ... }` et une fonction globale `window.debug(localDebug, ...args)` — pas un export ES. Chaque autre module déclare son propre `const LOCAL_DEBUG = true|false` en haut du fichier et appelle la fonction globale `debug(LOCAL_DEBUG, ...)` sans l'importer. Comme `debug()` est utilisé partout sans import, `debug.js` doit être le premier import dans `main.js`. Pour un nouveau module, reprends ce même schéma (const locale `LOCAL_DEBUG` + appels à `debug()` global) plutôt que d'importer un logger.

**Couche de stockage (`src/js/services/storage.js`).** Basée sur localStorage, une seule clé `"habitArray"`. Exporte un tableau mutable au niveau du module, `habitArray`, ainsi que `addHabit/deleteHabit/updateHabit/getHabit/clearHabits`, qui mutent tous `habitArray` et appellent `saveHabits()` pour persister. Il n'y a pas d'autre couche de données pour l'instant — toute nouvelle fonctionnalité nécessitant de la persistance devrait suivre ce même schéma charger/muter/sauvegarder-dans-localStorage plutôt que d'introduire un autre pattern.

**Découpage des composants (`src/js/components/habits/`).** La fonctionnalité habits — la seule entièrement construite — est découpée en trois parties ; reproduis ce découpage pour les autres composants (dashboard et calendar sont pour l'instant des stubs) :
- `habits.js` — logique/données pures (ex. `createHabit`, `editHabit`, `getFrequency`, `getDuration`, `searchTypes`), aucun event listener.
- `habitsUI.js` — rendu DOM et références aux éléments. À noter : de nombreuses références DOM (`habitsFormInput`, `habitsPopupOverlay`, `habitsCommandButton`, etc.) sont récupérées **une seule fois, à l'évaluation du module**, dans des `const` exportées — cela ne fonctionne correctement que sur les pages qui contiennent le markup correspondant (`habits.html`).
- `habitsEvents.js` — branche les listeners, en appelant à la fois `habits.js`, `habitsUI.js` et `storage.js`. Un seul formulaire de popup partagé est réutilisé pour les flux de création et d'édition, basculé via la variable de module `habitPopupMode` (`"create"` / `"edit"`) et pré-rempli via `insertDataInHabitPopup()`.

**Helpers DOM sûrs (`src/js/utils/dom.js`).** `safeQuery`, `safeQueryAll`, `safeId` encapsulent `querySelector`/`getElementById` et logguent via `debug()` au lieu de lever une erreur quand rien ne correspond (`exists()` vérifie l'absence de `null`). Utilise ces helpers plutôt que `document.querySelector` brut dans le nouveau code — c'est la convention établie dans tous les composants existants.

**Styles.** La structure SCSS reflète celle des composants JS (`abstracts/`, `base/`, `components/`, avec des sous-dossiers `components/dashboard/` et `components/habitManager/`). `src/scss/main.scss` est un manifeste de directives `@use` — une nouvelle feuille de style de composant doit y être ajoutée, sinon elle ne sera pas incluse dans le `public/css/style.css` compilé. Tout style doit toujours être écrit en SCSS (`src/scss/`), jamais directement dans `public/css/style.css`, qui est un fichier généré par `npm run sass` et ne doit pas être édité à la main.

## Conventions

- Les textes d'interface, les commentaires et la majorité des messages de commit sont en français ; garde cette cohérence dans le code lié aux habitudes.
- Les messages de commit suivent globalement Conventional Commits (`feat:`, `fix:`, `refactor:`, parfois scopés comme `feat(habits):`), mais le format n'est pas homogène (`feat :` vs `feat:`) — les deux sont acceptés, mais préfère l'absence d'espace avant les deux-points pour les nouveaux commits.
- Tout bloc de code écrit par une IA doit être annoncé par un commentaire `//AI made` juste au-dessus.
- Tout commit fait par une IA doit l'annoncer explicitement (par ex. dans le message de commit).