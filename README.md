# AXE

AXE est une application de productivité personnelle conçue pour aider les utilisateurs à organiser leurs habitudes, suivre leur progression et structurer leur quotidien.

Le projet est développé avec une approche progressive : chaque fonctionnalité est construite lorsque le besoin apparaît afin de garder une architecture claire, maintenable et évolutive.

---

## Objectif du projet

AXE a pour objectif de devenir un espace central de gestion personnelle regroupant :

* Gestion des habitudes
* Suivi de progression
* Statistiques personnelles
* Organisation du temps
* Planification
* Suivi des objectifs

L'objectif est de construire une application complète avec une architecture solide, en évoluant progressivement d'une application front-end locale vers une application complète avec backend.

---

# Technologies utilisées

## Front-end

* HTML5
* JavaScript ES6 Modules
* SCSS
* npm
* LocalStorage (stockage actuel)

## Librairies

* Chart.js (prévu pour les statistiques)

## Outils

* VS Code
* Git / GitHub
* Sass

---

# Architecture du projet

```
src
├── assets
├── font
│
├── js
│   ├── main.js
│   ├── debug.js
│   │
│   ├── components
│   │   ├── calendar
│   │   ├── dashboard
│   │   └── habits
│   │       ├── habits.js
│   │       ├── habitsEvents.js
│   │       └── habitsUI.js
│   │
│   ├── services
│   │   └── storage.js
│   │
│   ├── utils
│       ├── date.js
│       ├── dom.js
│       └── format.js
│
└── scss
    ├── abstracts
    ├── base
    └── components
```

---

# Organisation du code

## Components

Contient les fonctionnalités principales de l'application.

Exemple :

* `components/habits` : gestionnaire d'habitudes
* `components/dashboard` : affichage du tableau de bord
* `components/calendar` : calendrier

---

## Services

Contient les services indépendants de l'interface.

Actuellement :

* `storage.js`

Responsabilités :

* Sauvegarde des données
* Récupération des données
* Suppression des données

---

## Utils

Contient les fonctions utilitaires réutilisables.

Exemples :

* Protection des sélecteurs DOM
* Conversion des formats
* Gestion des dates

---

# Système de debug

AXE possède un système de debug global.

Chaque fichier peut définir son propre niveau de debug local :

```javascript
const LOCAL_DEBUG = true;

debug(LOCAL_DEBUG, "Message de debug");
```

Le debug global est contrôlé depuis `main.js`.

Cela permet d'activer ou désactiver facilement les logs pendant le développement.

---

# Fonctionnalités actuelles

## AXE 0.5 - Habit Manager

Statut : En développement

Fonctionnalités disponibles :

* Création d'habitudes
* Gestion du nom d'une habitude
* Gestion du type d'habitude
* Gestion de la fréquence :

  * Intervalle
  * Hebdomadaire
  * Mensuelle
* Gestion de la durée
* Stockage local des habitudes

Fonctionnalités restantes :

* Rendu dynamique des habitudes dans le dashboard
* Amélioration de l'interface
* Nettoyage et refactorisation du code

---

# Roadmap

## AXE 1 - Habit Manager

Objectif : Finaliser le système complet de gestion des habitudes.

Fonctionnalités :

* Création d'habitudes
* Modification d'habitudes
* Suppression d'habitudes
* Affichage dynamique des habitudes
* Système de suivi quotidien
* Gestion des séries (streaks)
* Amélioration UX/UI

---

## AXE 2 - Statistics & Progression

Objectif : Transformer les habitudes en données exploitables.

Fonctionnalités :

* Statistiques personnelles
* Graphiques de progression
* Historique des habitudes
* Calcul des performances
* Analyse des séries
* Visualisation des objectifs

---

## AXE 3 - Agenda & Organisation

Objectif : Ajouter une gestion complète du temps.

Fonctionnalités :

* Calendrier avancé
* Planning quotidien
* Évènements
* Rappels
* Organisation des tâches
* Connexion entre habitudes et agenda

---

## AXE 4 - Backend Update

Objectif : Transformer AXE en application complète avec une architecture client/serveur.

Fonctionnalités :

* Création d'un backend
* Base de données distante
* Authentification utilisateur
* Synchronisation des données
* Gestion des comptes
* API
* Sécurité des données

Technologies envisagées :

* Node.js
* Base de données SQL ou NoSQL
* API REST

---

# Philosophie de développement

AXE suit plusieurs principes :

* Construire uniquement ce qui est nécessaire
* Éviter la complexification prématurée
* Garder une architecture compréhensible
* Séparer clairement les responsabilités
* Améliorer progressivement la qualité du code

Le projet évolue par itérations successives :
fonctionnalité → utilisation → amélioration → refactorisation.

---

# Installation

Cloner le projet :

```bash
git clone <repository-url>
```

Installer les dépendances :

```bash
npm install
```

Lancer le projet :

```bash
npm run dev
```

---

# Licence

Projet personnel en développement.
