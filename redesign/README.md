# AXE — Proposition de redesign

Prototype isolé, séparé du code réel de l'app (`src/`, `public/`). Rien dans
ce dossier n'est chargé par `index.html` ou `public/pages/*.html` : c'est un
environnement de test pour évaluer une direction visuelle avant de la porter
dans le vrai code.

## Aperçu

Aucune étape de build pour **consulter** les pages : elles chargent le CSS
déjà compilé dans `assets/css/`. Ouvrez les fichiers via Live Server (ou
équivalent), comme le reste du projet :

- `redesign/index.html` — Dashboard
- `redesign/habits.html` — Gestionnaire d'habitudes
- `redesign/schedule.html` — Emploi du temps
- `redesign/graphs-stats.html` — Graphiques & stats

Si vous ouvrez ces pages **depuis le même serveur/port** que l'app réelle
(ex. Live Server sur `5501`), le dashboard, le tableau d'habitudes et les
stats affichent **vos vraies habitudes** (lues en lecture seule depuis
`localStorage["habitArray"]`). Sinon — ou si ce tableau est vide — un jeu de
données de démonstration est généré automatiquement. Un bandeau en haut de
chaque page indique dans quel cas vous êtes.

**Aucune action ici n'écrit dans le localStorage réel.** Cocher une
habitude, supprimer une ligne, etc. ne modifient qu'une copie en mémoire de
la page ouverte ; un rechargement retrouve l'état d'origine. Voir
`assets/js/data.js`.

//AI made
## Styles (SCSS)

Le CSS de `assets/css/` est désormais généré depuis `assets/scss/` (un
fichier `.scss` par fichier `.css`, même nom, pas de manifeste commun — comme
les fichiers CSS d'origine, chacun est indépendant et ne dépend que des
custom properties définies dans `tokens.css`). Pour modifier un style,
éditez le `.scss` correspondant puis recompilez :

```bash
npm run sass:redesign          # compile une fois
npm run sass:redesign:watch    # recompile à chaque modification
```

Ne modifiez jamais les `.css` de ce dossier à la main : ils sont écrasés au
prochain `npm run sass:redesign`.

## Direction

- La grille des couleurs part de vos variables existantes
  (`$main-blue`, `$main-darkBlue`, `$main-violet`, `$main-grey`...) plutôt que
  d'en inventer une nouvelle : le bleu de marque reste l'ancre.
- **Le mode clair est le défaut**, y compris si le système est en sombre
  (plus de bascule automatique via `prefers-color-scheme`). Le mode sombre
  active `$font-color-main--dark-mode` (`#E5E7EB`), défini dans
  `_variables.scss` mais jamais utilisé jusqu'ici — accessible uniquement via
  le bouton en haut à droite, préférence mémorisée d'une visite à l'autre.
- Fond de page très sobre : un seul fondu diagonal très léger sur `body`
  (`assets/css/base.css`), fond ambiant animé (halos flous en JS) retiré.
  Les dégradés de boutons ont été aplatis en couleurs unies (boutons
  "Nouveau", remplissage du graphique, barres du classement) — seule la
  pilule de nav du header (`.header__menu`) garde son dégradé bleu → marine,
  comme dans l'app actuelle.
- Le motif signature du cadre en tirets bleus (`border: 3px dashed`) est
  conservé et généralisé plutôt que supprimé — c'est un des éléments les
  plus identifiables de l'app actuelle.
- Grands nombres (streaks, stats) en `Frick Condensed`, une police déjà
  présente dans `src/font/Frick/` mais jamais reliée à un `font-family` CSS.
- Effets dynamiques (JS, dans `assets/js/`) : anneau de progression du jour,
  confettis + pulsation à la validation d'une habitude, graphiques Chart.js
  (déjà une dépendance du projet), heatmap de régularité façon
  "contributions" GitHub, ligne "maintenant" dans l'agenda, révélation au
  scroll, compteurs animés, fond ambiant. Tout respecte
  `prefers-reduced-motion`.

## Ce qui n'a pas été touché

- **Checkmark** (`.container` / `.checkmark`, dans `assets/css/components.css`,
  zone "ZONE PROTÉGÉE") : copié à l'identique de
  `src/scss/components/dashboard/_habit.scss`. Même structure DOM
  (`label.container > input + div.checkmark`), mêmes couleurs, même ombre
  portée dure. Vérifié à l'écran en zoomant dessus (capture jointe pendant
  les tests), coché et décoché.
- **Popups** (création/édition d'habitude + recherche, dans `habits.html`) :
  markup et CSS copiés à l'identique de `public/pages/habits.html` et du
  `public/css/style.css` compilé. Elles s'ouvrent/se ferment comme
  aujourd'hui (mêmes classes `hiddenPopup`/`hiddenSearchPopup`), mais leur
  contenu interne (création réelle, recherche réelle, pré-remplissage en
  édition) n'a volontairement pas été réimplémenté — ce n'est pas l'objet de
  ce redesign. Un petit bandeau le rappelle quand on les ouvre.

## Liste des changements de classes/ids

Consigne respectée : **aucune classe ni id existant n'a été renommé,
supprimé ou détourné.** Tout ce qui suit est un ajout, nécessaire pour la
partie visuelle qui n'existait pas déjà (nouveaux éléments, ou pages qui
étaient vides/statiques dans l'app actuelle).

### Ajouts transverses (toutes les pages)
| Ajout | Où / pourquoi |
|---|---|
| `#themeToggle`, `.header__theme-toggle`, `.icon-sun`, `.icon-moon` | Bouton clair/sombre, nouveau |
| `#previewNote`, `.preview-note` | Bandeau "démo vs. vraies données" |
| `.page-shell`, `.page-header`, `.page-header__eyebrow/__title/__subtitle` | Nouvel en-tête de page (titre + sous-titre) |
| `aria-current="page"` | Attribut (pas une classe) sur le lien de nav actif |
| `.ambient-bg`, `.reveal`/`.is-visible`, `.confetti-layer`/`.confetti-piece`, `.toast-layer`/`.toast`, `.checkmark-pulse`/`.is-active` | Effets visuels (fond, scroll-reveal, confettis, toasts) — tous des éléments injectés en JS, à côté des éléments existants, jamais à l'intérieur du `.checkmark` |

### Dashboard (`index.html`)
| Ajout | Où / pourquoi |
|---|---|
| `.habits-box__progress`, `#todayProgress` | Anneau de progression du jour, dans `.habits-box__title` (qui ne contenait qu'un texte brut ; il enveloppe maintenant ce texte dans un `<span>` — aucun JS ne lisait sa structure interne) |
| `.schedule__agenda*` | Aperçu d'agenda (illustratif, voir plus bas) dans `.schedule` |
| `.graph__summary`, `.graph__stat*`, `.graph__canvas-wrap`, `#dashboardWeeklyChart`, `#statDoneToday`, `#statWeekTotal` | Mini graphique Chart.js + chiffres clés dans `.graph` |
| `data-tier` sur `.habits__cell__streak` | Attribut pour colorer le badge streak selon sa valeur (froid/tiède/chaud) |

### Gestionnaire d'habitudes (`habits.html`)
| Ajout | Où / pourquoi |
|---|---|
| `.habitCell--removing` | Animation de suppression (en mémoire uniquement) |
| `.habitManager__empty` | État "aucune habitude" |

### Emploi du temps (`schedule.html`)
| Ajout | Où / pourquoi |
|---|---|
| `.calendar__*` (grid, corner, day-label, body, hours, hour, day-col, event, now-line...) | Tout le contenu de `.calendar` — ce conteneur est **vide dans l'app actuelle** (`calendar.js` ne fait que récupérer des références DOM, AXE 3 n'est pas commencé). Illustration conceptuelle, évènements fictifs. |

### Graphiques & stats (`graphs-stats.html`)
| Ajout | Où / pourquoi |
|---|---|
| `.stats-*` (grid, tile, panel, heatmap, leaderboard...) | Toute la page — le `<main>` réel est **entièrement vide aujourd'hui** (AXE 2 n'a pas commencé). Calculs réels (complétions, séries, heatmap) à partir des vraies habitudes quand elles sont disponibles. |

### Une correction CSS hors zone protégée
`.habitPopupOverlay, .searchHabitPopupOverlay { z-index: 60; }` a été ajouté
dans `layout.css` (pas dans la zone protégée de `components.css`). Le header
réel n'est pas *sticky* et n'a donc jamais eu besoin de rivaliser avec les
popups pour l'empilement ; comme ce redesign rend le header sticky avec un
z-index, sans cette ligne les popups s'ouvriraient partiellement sous le
header. Repéré en testant l'ouverture réelle de la popup dans un navigateur.

## Testé

Les 4 pages ont été chargées dans Chromium (Playwright) : aucune erreur
console/réseau, capture d'écran de chaque page, zoom sur le checkmark
(coché/décoché), bascule sombre, largeur mobile (390px) + menu burger,
ouverture de la popup existante, suppression d'une ligne du tableau.

## Pas fait exprès (hors périmètre d'un redesign visuel)

- Création/édition réelle d'habitude, recherche réelle : les popups
  s'ouvrent mais leurs actions ne sont pas branchées sur `services/storage.js`.
- Vue "mois" du calendrier, icônes `+`/recherche/agrandir : pas de logique
  derrière dans l'app actuelle, donc pas simulées ici non plus.
