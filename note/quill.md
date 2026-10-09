# Quill 2 : aide-mémoire

> Note rédigée par une IA (Claude). Version utilisée dans le projet : **quill ^2.0.3** (voir `package.json`).
> Doc officielle : https://quilljs.com/docs (sections *API*, *Delta*, *Formats*, *Modules*).

Dans AXE, Quill est chargé en script classique dans `public/pages/scolar.html` :

```html
<link rel="stylesheet" href="../../node_modules/quill/dist/quill.snow.css">
<script src="../../node_modules/quill/dist/quill.js"></script>
```

`Quill` est donc une **variable globale** (comme `debug()`), pas un import ES.
Le code qui crée les éditeurs est dans `src/js/components/scolar/flashcardsEditor.js` (`editors.front` / `editors.back`).

---

## 1. Créer un éditeur

```js
const quill = new Quill(conteneur, options);   // conteneur = élément DOM ou sélecteur CSS
```

| Option        | Rôle |
|---------------|------|
| `theme`       | `"snow"` (barre d'outils classique), `"bubble"` (barre flottante sur la sélection) ou `null` (aucun style). Le CSS du thème doit être chargé. |
| `placeholder` | Texte affiché quand l'éditeur est vide. |
| `readOnly`    | `true` = non éditable (pratique pour **afficher** une carte sauvegardée). |
| `modules`     | Config des modules : `toolbar`, `history`, `keyboard`, `clipboard`. |
| `formats`     | Liste blanche des formats autorisés, ex. `["bold", "italic", "size"]`. Tout le reste est ignoré (y compris au collage). Par défaut : tous. |
| `bounds`      | Élément qui limite la position des infobulles/menus (défaut : `document.body`). |

Une fois créé, Quill ajoute dans le conteneur un `div.ql-editor` (la zone `contenteditable`).
`quill.root` donne accès à ce div.

---

## 2. Le format Delta (comment Quill stocke le contenu)

Quill ne stocke pas du HTML mais un **Delta** : un objet `{ ops: [...] }`, une liste d'opérations.

```js
{
  ops: [
    { insert: "Quelle est la " },
    { insert: "capitale", attributes: { bold: true, color: "#e60000" } },
    { insert: " de la France ?" },
    { insert: "\n", attributes: { align: "center" } }   // format de ligne : porté par le "\n"
  ]
}
```

À retenir :
- **Un document se termine toujours par `"\n"`.** Un éditeur vide vaut `{ ops: [{ insert: "\n" }] }`.
- Les **formats inline** (gras, couleur…) sont sur le texte ; les **formats de bloc** (align, header, list…) sont sur le `\n` qui termine la ligne.
- Dans un Delta de *modification*, on trouve aussi `retain: n` (sauter n caractères) et `delete: n` (supprimer n caractères).
- Un Delta est du JSON pur : c'est ce qu'on sauvegarde dans localStorage (`createFlashcard` → `addFlashcard`).

---

## 3. Lire et écrire le contenu

Les positions (`index`) et longueurs (`length`) se comptent en caractères. Un embed (image…) compte pour 1.

| Méthode | Ce qu'elle fait |
|---------|-----------------|
| `getContents(index?, length?)` | Renvoie le Delta (tout le document par défaut). **À utiliser pour sauvegarder.** |
| `setContents(delta, source?)` | Remplace tout le contenu. `setContents([])` vide l'éditeur. |
| `updateContents(delta, source?)` | Applique un Delta de modification (avec `retain`/`delete`). |
| `getText(index?, length?)` | Texte brut, sans formats (utile pour vérifier qu'une face n'est pas vide). |
| `getLength()` | Longueur totale. **Vaut 1 quand l'éditeur est vide** (à cause du `\n` final). |
| `insertText(index, texte, formats?, source?)` | Insère du texte, éventuellement formaté : `insertText(0, "Salut", { bold: true })`. |
| `deleteText(index, length, source?)` | Supprime une portion. |
| `insertEmbed(index, type, valeur, source?)` | Insère un embed : `insertEmbed(5, "image", "https://...")`. |
| `getSemanticHTML(index?, length?)` | Renvoie du HTML propre (nouveau dans Quill 2). Utile pour afficher sans Quill. |

```js
// Tester si une face est vide
const estVide = quill.getText().trim().length === 0;

// Sauvegarder / recharger
const delta = quill.getContents();
quill.setContents(delta);
```

---

## 4. Appliquer des formats

| Méthode | Ce qu'elle fait |
|---------|-----------------|
| `format(nom, valeur, source?)` | Applique un format à la **sélection actuelle**. Si la sélection est vide (curseur), le format s'appliquera au prochain texte tapé. |
| `formatText(index, length, nom, valeur, source?)` | Format inline sur une portion. Accepte aussi un objet : `formatText(0, 5, { bold: true, italic: true })`. |
| `formatLine(index, length, nom, valeur, source?)` | Format de bloc sur les lignes touchées (align, header, list…). |
| `removeFormat(index, length, source?)` | Retire tous les formats d'une portion (comme le bouton `ql-clean`). |
| `getFormat(index?, length?)` | Formats présents à la sélection/au curseur, ex. `{ bold: true, size: "18px" }`. Si les formats diffèrent dans la portion, la valeur est un tableau. |

Pour **retirer** un format : passer `false` (ou `null`) comme valeur, ex. `quill.format("bold", false)`.

### Formats disponibles

**Inline** : `bold`, `italic`, `underline`, `strike`, `color`, `background`, `font`, `size`, `script` (`"sub"`/`"super"`), `link`, `code`.

**Bloc** : `header` (1 à 6), `align` (`"center"`, `"right"`, `"justify"`), `list` (`"ordered"`, `"bullet"`, `"checked"`, `"unchecked"`), `blockquote`, `code-block`, `indent`, `direction` (`"rtl"`).

**Embed** : `image`, `video`, `formula` (nécessite KaTeX).

---

## 5. Sélection et focus

| Méthode | Ce qu'elle fait |
|---------|-----------------|
| `getSelection(focus = false)` | Renvoie `{ index, length }` ou `null` si l'éditeur n'a pas le focus. Avec `true`, donne d'abord le focus. |
| `setSelection(index, length?, source?)` | Place le curseur ou sélectionne. `setSelection(null)` retire la sélection (et le focus). |
| `focus()` / `blur()` / `hasFocus()` | Gestion du focus. |
| `getBounds(index, length?)` | Position en pixels (`{ left, top, height, width }`) relative au conteneur, pour placer un menu flottant. |
| `scrollSelectionIntoView()` | Fait défiler jusqu'au curseur. |

**Format « en attente » :** si tu cliques sur **B** sans sélection puis que tu déplaces le curseur ou que l'éditeur perd le focus, ce format est perdu (comportement normal de Quill).

---

## 6. Activer / désactiver

```js
quill.disable();        // = enable(false) → lecture seule
quill.enable();         // réactive l'édition
quill.isEnabled();      // true / false
```

---

## 7. Événements

```js
quill.on("text-change", (delta, ancienContenu, source) => { ... });
quill.on("selection-change", (range, ancienneRange, source) => {
    if (range === null) { /* l'éditeur a perdu le focus */ }
});
quill.on("editor-change", (nomEvenement, ...args) => { ... });  // les deux à la fois

quill.once("text-change", handler);   // une seule fois
quill.off("text-change", handler);    // retirer un listener
```

- `text-change` : le contenu a changé. `delta` contient **seulement la modification**, pas tout le document.
- `selection-change` : le curseur ou la sélection a bougé. `range` vaut `null` lors d'un blur.

### Le paramètre `source`

Presque toutes les méthodes d'écriture acceptent `source` en dernier argument :

| Valeur | Effet |
|--------|-------|
| `"api"` (défaut) | Modification par le code. Déclenche les événements. |
| `"user"` | Fait comme si l'utilisateur l'avait fait. **Ignorée si l'éditeur est désactivé.** |
| `"silent"` | Ne déclenche **aucun** événement. Pratique pour charger une carte sans déclencher un `text-change`. |

---

## 8. Modules

### Toolbar

Deux façons de la définir :

```js
// a) Pointer vers du HTML existant (ce que fait AXE) : les classes ql-xxx deviennent des boutons
modules: { toolbar: "#flashcardToolbarFront" }

// b) La générer depuis un tableau
modules: {
    toolbar: [
        [{ size: ["12px", "18px", false, "24px"] }],   // false = taille par défaut
        ["bold", "italic", "underline"],
        [{ color: [] }, { background: [] }],          // [] = palette par défaut
        [{ align: [] }],
        ["clean"]
    ]
}
```

En HTML : `<button class="ql-bold">`, `<select class="ql-size">` avec des `<option value="...">`. Une option sans `value` = valeur par défaut.

**Une barre d'outils ne peut servir qu'à un seul éditeur.** C'est pour ça que `flashcardsEditor.js` clone la barre du recto pour le verso.

Remplacer le comportement d'un bouton (ou en créer un) avec un handler :

```js
modules: {
    toolbar: {
        container: "#maToolbar",
        handlers: {
            bold(valeur) { this.quill.format("bold", !valeur); }   // this.quill = l'éditeur
        }
    }
}
// ou après coup :
quill.getModule("toolbar").addHandler("image", () => { ... });
```

Quill ajoute la classe `ql-active` aux boutons dont le format est présent au curseur.

### History (annuler / rétablir)

```js
modules: { history: { delay: 1000, maxStack: 100, userOnly: true } }
// delay : changements regroupés en une seule étape s'ils sont espacés de moins de delay ms
// userOnly : n'enregistre que les modifs de l'utilisateur

quill.history.undo();
quill.history.redo();
quill.history.clear();   // vider l'historique (ex. après avoir chargé une carte)
```

Ctrl+Z / Ctrl+Y (ou Ctrl+Maj+Z) fonctionnent déjà par défaut.

### Keyboard (raccourcis)

```js
quill.keyboard.addBinding({ key: "s", shortKey: true }, (range, context) => {
    // shortKey = Ctrl sous Windows, Cmd sous Mac
    // return true pour laisser les autres raccourcis s'exécuter
});
```

Raccourcis par défaut : Ctrl+B/I/U, Tab (indentation dans les listes), etc.
Pour qu'un raccourci passe **avant** ceux de Quill, déclare-le dans `modules.keyboard.bindings` à la création.

### Clipboard (copier-coller)

```js
quill.clipboard.dangerouslyPasteHTML(0, "<b>Texte</b>");   // insère du HTML converti en Delta
const delta = quill.clipboard.convert({ html: "<p>Salut</p>" });

// Modifier ce qui est collé, ex. retirer toutes les couleurs :
quill.clipboard.addMatcher(Node.ELEMENT_NODE, (noeud, delta) => {
    delta.ops.forEach(op => {
        if (op.attributes) { delete op.attributes.color; delete op.attributes.background; }
    });
    return delta;
});
```

`dangerouslyPasteHTML` : « dangerously » parce qu'il ne faut jamais lui passer du HTML venant d'une source non fiable.

---

## 9. Méthodes statiques (sur `Quill`, pas sur l'instance)

| Méthode | Ce qu'elle fait |
|---------|-----------------|
| `Quill.import(chemin)` | Récupère une classe interne : `"formats/bold"`, `"attributors/style/size"`, `"modules/toolbar"`, `"delta"`... |
| `Quill.register(def, ecraser?)` | Enregistre un format/module/attributor. Le `true` final autorise à écraser l'existant. **À faire avant `new Quill(...)`.** |
| `Quill.find(noeudDOM)` | Renvoie l'instance Quill liée à un conteneur (ou le blot d'un nœud). |
| `Quill.debug(niveau)` | `"error"`, `"warn"`, `"log"`, `"info"` ou `false`. |

### Attributors style vs class

Par défaut, Quill applique certains formats par **classe CSS** (`class="ql-size-large"`, `ql-align-center`), ce qui oblige à charger le CSS de Quill pour l'affichage.
Les **attributors style** les écrivent en **style inline** (`style="font-size: 18px"`), ce qui est lisible partout. C'est ce que fait AXE :

```js
const Size = Quill.import("attributors/style/size");
Size.whitelist = ["12px", "14px", "18px", "24px", "32px", "48px"];   // tailles acceptées
Quill.register(Size, true);
Quill.register(Quill.import("attributors/style/align"), true);
```

Autres attributors utiles : `attributors/style/font`, `attributors/style/color`, `attributors/style/background`, `attributors/style/direction` (couleur et fond sont déjà en style inline par défaut).

---

## 10. Recettes pour AXE

```js
// Vider les deux faces (ex. à la fermeture de la popup ou après « Enregistrer »)
editors.front.setContents([], "silent");
editors.back.setContents([], "silent");
editors.front.history.clear();
editors.back.history.clear();

// Recharger une carte sauvegardée dans l'éditeur (mode édition)
editors.front.setContents(flashcard.content.front, "silent");
editors.back.setContents(flashcard.content.back, "silent");

// Refuser une carte vide
if (editors.front.getText().trim() === "" || editors.back.getText().trim() === "") return;

// Afficher une carte sauvegardée dans la liste, deux options :
// a) un Quill en lecture seule, sans barre d'outils
const viewer = new Quill(faceElement, { theme: null, readOnly: true, modules: { toolbar: false } });
viewer.setContents(flashcard.content.front);
// b) convertir en HTML avec un Quill temporaire hors du DOM (plus léger s'il y a beaucoup de cartes)
const tmp = new Quill(document.createElement("div"));
tmp.setContents(flashcard.content.front);
faceElement.innerHTML = tmp.getSemanticHTML();
```

---

## 11. Pièges courants

- **Ne pas modifier `quill.root.innerHTML` directement** : Quill ne voit pas le changement et son modèle se désynchronise. Passe par l'API (`setContents`, `insertText`...).
- `getLength()` vaut 1 pour un éditeur vide : pour tester le vide, utilise `getText().trim()`.
- `Quill.register(...)` doit être appelé **avant** la création des éditeurs.
- La valeur d'un format doit figurer dans la `whitelist` de l'attributor, sinon elle est ignorée (ex. `size: "20px"` avec la liste actuelle).
- Les formats de bloc sont portés par le `\n` : `formatText` sur `align` ne fait rien, il faut `formatLine`.
- Cacher la popup (classe CSS) ne réinitialise rien : contenu, curseur et boutons `ql-active` restent tels quels.
