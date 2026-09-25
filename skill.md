---
name: axe-scss-style
description: Règles et habitudes de style SCSS observées dans src/scss/ du projet AXE. À suivre pour tout nouveau fichier ou toute modification de style dans ce dépôt.
---

# Style SCSS — AXE

Règles déduites de l'analyse de `src/scss/`. Ce ne sont pas des préférences théoriques mais des habitudes réellement suivies dans le code existant — à reproduire pour rester cohérent.

## Imports en tête de fichier

Chaque partial de composant commence systématiquement par les deux mêmes `@use`, avec les mêmes alias, chemin relatif ajusté selon la profondeur du dossier :

```scss
@use '../abstracts/_variables.scss' as v;
@use '../abstracts/_mixins.scss' as m;
```

(`../../abstracts/...` depuis `components/habitManager/` ou `components/dashboard/`.)

- Alias toujours `v` pour les variables, `m` pour les mixins — ne jamais renommer.
- Si le fichier a besoin de fonctions Sass de couleur (`color.adjust`), ajouter `@use "sass:color";` juste après, avec le commentaire `//AI made` au-dessus si c'est toi (Claude) qui l'ajoutes.
- Un nouveau partial doit être ajouté dans `main.scss` via `@use`, sinon il n'est jamais compilé.

## Nommage des variables (`abstracts/_variables.scss`)

- Préfixe par catégorie : `$font-*`, `$main-*`, `$secondary-*`.
- Le suffixe de couleur mélange deux styles déjà en place — les deux sont acceptés mais ne pas en inventer un troisième :
  - kebab-case : `$font-color-main--lite-mode`, `$font-color-main--dark-mode`
  - camelCase : `$main-darkBlue`, `$main-liteGrey`, `$secondary-liteGrey`
- Toute nouvelle couleur récurrente doit passer par une variable ici plutôt que d'être écrite en dur — même si le code existant contient déjà des hex codés en dur (`#000926`, `#ccc`, `#ECEDF3`...) qui dupliquent des variables existantes. Ne pas reproduire cette dérive dans le nouveau code.

## Nommage des mixins (`abstracts/_mixins.scss`)

- Très majoritairement kebab-case : `day-hour-box-style`, `border-section-dashboard`, `title-section`, `text-habit-cell`, `center`.
- Une exception existante en camelCase : `popupHabitFormBorder`. Ne pas la renommer sans raison, mais préférer le kebab-case pour tout nouveau mixin.
- Un mixin regroupe un petit bloc de styles réutilisés tel quel (pas de paramètres pour l'instant) : couleur + police, ou bordure + radius, ou layout flex de centrage.

## Structure BEM par nesting `&__`

Convention systématique dans tous les composants : bloc racine en camelCase ou kebab-case, éléments enchaînés via `&__` imbriqués, parfois sur plusieurs niveaux :

```scss
.habits__cell__title { ... }
.habitManagerMenu__icons { ... }
.header__hour-Box__text { ... }
```

- Les modificateurs d'état utilisent tantôt `&--modifier` façon BEM (`&--done`, `&--right`), tantôt une classe séparée togglée en JS (`.activeTabs`, `.durationActive`, `.hiddenPopup`, `.hiddenTypeProposition`). Les deux formes coexistent dans le code existant :
  - `--modifier` pour un état de style permanent lié au contenu/variante,
  - classe `hiddenX` / `activeX` séparée quand l'état est piloté par du JS (ajout/retrait de classe).
- Suivre cette même distinction pour du nouveau code plutôt que d'en inventer une troisième.

## Regroupement des propriétés par lignes vides

À l'intérieur d'un bloc de règles, les propriétés sont groupées par thème et séparées par une ligne vide, dans cet ordre approximatif : position/layout → dimensions/espacement → couleur/fond → typographie → transition. Exemple représentatif (`_habit.scss`) :

```scss
&__cell {
    position: relative;

    margin-bottom: 14px;
    background-color: #fff;
    padding: 14px 20px 14px 18px;
    min-height: 60px;
    width: 90%;

    border-radius: 18px;
    border: 1px solid #ECEDF3;
    box-shadow: 0 1px 2px rgba(15, 82, 186, 0.06), 0 6px 16px rgba(15, 82, 186, 0.06);

    display: inline-flex;
    align-items: center;

    transition: transform ease-in-out 200ms, box-shadow ease-in-out 220ms, border-color ease-in-out 220ms;
}
```

Reproduire ce blocage par lignes vides plutôt que d'écrire toutes les déclarations à la suite.

## Indentation

Le fichier de base est indenté en 4 espaces (`_reset.scss` et la plupart des composants récents utilisent des tabulations ou 4 espaces de façon incohérente selon le fichier — `_reset.scss` et certaines parties de `_habit.scss`/`_tabs.scss` utilisent des tabs, le reste des espaces). Pour tout nouveau fichier ou nouvelle section : **utiliser 4 espaces**, ne pas mélanger avec des tabs dans le même bloc.

## Transitions et hover

- Raccourci `transition: .2s;` ou `transition: all ease-in-out 200ms;` très fréquent pour les hovers simples.
- Pour assombrir une couleur au survol, utiliser `color.adjust()` plutôt qu'une variable de couleur dédiée :
  ```scss
  &:hover {
      background-color: color.adjust(v.$main-blue, $lightness: -10%);
  }
  ```
- Micro-interaction de survol récurrente sur les cartes/cellules : `transform: translateY(-2px)` combiné à une transition sur `box-shadow`/`border-color`.

## Sections "dashboard" (pattern boîte + contenu)

Les trois blocs du dashboard (`habits`, `schedule`, `graph`) suivent le même moule à deux niveaux :

```scss
.xxx-box {
    margin: auto;
    flex: <ratio>;              // ex. 1 ou 1.618 (nombre d'or) selon la largeur relative voulue

    &__title {
        @include m.title-section;
    }
}

.xxx {
    height: 600px;              // ou 300px pour graph
    margin: 40px;
    background-color: white;    // ou une teinte proche
    @include m.border-section-dashboard;
}
```

Reproduire ce même moule (`*-box` avec `&__title`, puis bloc de contenu avec `border-section-dashboard`) pour toute nouvelle section du dashboard plutôt qu'une structure ad hoc.

## Annotations et provenance

- Tout bloc ajouté par une IA est précédé du commentaire `//AI made` (déjà en place dans `_popupSearch.scss`, `_tabs.scss`, `_table.scss`, `_habit.scss`) — règle déjà documentée dans `CLAUDE.md`, confirmée par l'usage réel.
- Les snippets copiés d'une source externe sont crédités en commentaire au-dessus du bloc, ex. `// Hamburger menu, code from uiverse` ou `/* From Uiverse.io by Shoh2008 */`. Ces blocs (ex. `.checkbox-wrapper-4`, `.container`/`.checkmark`) utilisent des custom properties CSS (`--input-focus`, etc.) — c'est la seule zone du projet qui fait ça ; ne pas généraliser ce pattern ailleurs sans raison.
- Les commentaires de section sont en français et souvent minimalistes (`//menu tabs`, `//faire disparaitre le menu`, `//animation`).

## Unités

Mix rem/px déjà présent : `px` dominant (tailles de police, espacements, radius), `rem` ponctuellement dans les popups (`1.8rem`, `.95rem`, `1rem`). Ne pas chercher à unifier rétroactivement ; pour du nouveau code dans un composant existant, aligner sur l'unité déjà utilisée dans ce composant.

## Points d'incohérence connus (ne pas reproduire, mais ne pas non plus "corriger" sans qu'on te le demande)

- `main.scss` référence `components/habitManager/tabs.scss` (sans underscore) alors que le fichier s'appelle `_tabs.scss` — fonctionne car Sass résout les deux formes, mais à ne pas imiter pour un nouveau `@use`.
- Couleurs codées en dur qui dupliquent des variables existantes (`#000926` au lieu de `v.$main-darkBlue`, `#0F52BA` au lieu de `v.$main-blue`).
- Indentation tabs/espaces mélangée selon les fichiers.
