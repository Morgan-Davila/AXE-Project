Voici le document que je ferais pour préparer **Axis 1.0 Release** et surtout poser des fondations solides pour Axis 2 → Axis 10.

---

# AXIS 1 — Refactorisation des fondations

## Objectif

Transformer le prototype actuel en une base saine, modulaire et extensible.

---

# 1. Réorganiser l'arborescence JS

### Actuel

```txt
global/
    events.js
    storage.js
    ui.js
```

### Nouveau

```txt
js/
│
├── components
│   ├── habits
│   │      habits.js
│   │      habitsUI.js
│   │      habitsEvents.js
│   │
│   ├── dashboard
│   │      dashboard.js
│   │
│   └── calendar
│          calendar.js
│
├── models
│      Habit.js
│
├── services
│      storage.js
│
├── utils
│      date.js
│      format.js
│
└── main.js
```

---

# 2. Créer le modèle Habit

Créer :

```txt
models/Habit.js
```

avec :

```js
export function createHabit(data){
    return {
        id: Date.now(),

        name: data.inputName,

        type: data.inputType,

        frequency: Number(data.inputFrequency),

        duration: Number(data.inputDuration),

        streak: 0,

        createdAt: Date.now()
    };
}
```

---

# 3. Refaire complètement storage.js

Créer :

```txt
services/storage.js
```

Contenant :

### habitArray

```js
export let habitArray = ...
```

### saveHabits()

```js
saveHabits()
```

### addHabit()

```js
addHabit(habit)
```

### deleteHabit()

```js
deleteHabit(id)
```

### updateHabit()

```js
updateHabit(id,data)
```

### loadHabits()

```js
loadHabits()
```

Le localStorage ne doit plus apparaître ailleurs.

---

# 4. Créer utils/format.js

Déplacer :

```js
formatDuration()
```

Créer :

```js
formatFrequency()
```

Créer :

```js
formatDate()
```

Créer :

```js
formatStreak()
```

---

# 5. Renommer les fonctions

Remplacer :

```js
initHabitCell()
```

par :

```js
renderHabits()
```

---

Remplacer :

```js
initEvents()
```

par :

```js
setupEvents()
```

---

Remplacer :

```js
initPopupEvent()
```

par :

```js
setupHabitForm()
```

---

Remplacer :

```js
initFrequencySlider()
```

par :

```js
setupFrequencySlider()
```

---

Remplacer :

```js
initDurationSlider()
```

par :

```js
setupDurationSlider()
```

---

# 6. Séparer UI et logique

## habitsEvents.js

Gestion :

* popup
* boutons
* formulaire

---

## habitsUI.js

Gestion :

* renderHabits()
* création des cellules
* affichage

---

## habits.js

Logique métier :

* createHabit()
* addHabit()
* deleteHabit()
* updateHabit()

---

# 7. Ne plus stocker les valeurs affichées

Ne pas stocker :

```js
"2 h 30 min"
```

mais :

```js
9000
```

---

Ne pas stocker :

```js
"Toutes les semaines"
```

mais :

```js
7
```

L'affichage se fera avec :

```js
formatDuration()

formatFrequency()
```

---

# 8. Ajouter un id unique

Chaque habitude :

```js
{
    id: 173927382,

    name,

    type,

    frequency,

    duration,

    streak,

    createdAt
}
```

Cela préparera :

* suppression
* édition
* backend
* statistiques

---

# 9. Protéger tous les querySelector

Faire :

```js
if(element){
}
```

sur :

* frequencySlider
* durationSlider
* popup
* boutons
* tables

pour éviter les erreurs entre pages.

---

# 10. Supprimer les imports inutiles

Vérifier :

```js
ui.js
events.js
```

et supprimer tous les imports jamais utilisés.

---

# 11. Factoriser le header et le footer

Objectif futur :

Ne plus avoir :

* index.html
* habits.html
* schedule.html
* graph.html

avec chacun :

* header
* footer

dupliqués.

Préparer :

```txt
components/
    header.html
    footer.html
```

---

# 12. Uniformiser les noms

Préférer :

```js
name
type
frequency
duration
streak
createdAt
```

au lieu de :

```js
inputName
inputDuration
inputFrequency
```

car ces noms décrivent le DOM et non la donnée.

---

# 13. Préparer le Dashboard

Créer :

```txt
components/dashboard/dashboard.js
```

Contenant :

```js
renderTodayHabits()

renderStats()

renderSchedule()
```

---

# 14. Préparer Axis 2

Créer :

```txt
components/calendar/
```

pour accueillir :

* FullCalendar
* emploi du temps
* événements

---

# 15. Préparer Axis 3

Créer :

```txt
components/stats/
```

pour :

* graphiques
* streaks
* temps total
* histogrammes

---

# 16. Préparer Axis 4 (Backend)

Faire comme si les données venaient déjà d'une API.

Aujourd'hui :

```txt
localStorage
```

Demain :

```txt
fetch("/api/habits")
```

Le reste du code ne devra pas changer.

---

# 17. Nettoyer SCSS

Créer :

```txt
components/
    header
    footer
    calendar
    habitManager
    dashboard
```

et éventuellement :

```txt
pages/
    habits
    schedule
    stats
```

pour éviter que les fichiers dépassent 500 lignes.

---

# 18. Ajouter un README GitHub

Avec :

### Présentation

Axis est une application personnelle de productivité.

---

### Technologies

* HTML
* SCSS
* JavaScript ES6

---

### Roadmap

Axis 1 :
Gestion des habitudes.

Axis 2 :
Calendrier.

Axis 3 :
Statistiques.

Axis 4 :
Backend.

Axis 5 :
Desktop Electron.

Axis 6 :
Notifications.

Axis 7 :
Authentification.

Axis 8 :
PWA.

Axis 9 :
Version mobile.

Axis 10 :
AI Analyzer.

---

# Priorité réelle avant publier Axis 1

## Obligatoire

✅ modèle Habit

✅ storage.js propre

✅ format.js

✅ renderHabits()

✅ séparation UI / logique

✅ id unique

✅ protection des querySelector

---

## Plus tard

⚪ header/footer dynamiques

⚪ architecture backend

⚪ Electron

⚪ PWA

⚪ AI Analyzer

Avec ces changements, tu auras des fondations suffisamment propres pour faire évoluer Axis pendant plusieurs années sans être obligé de tout réécrire.
