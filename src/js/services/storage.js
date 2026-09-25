const LOCAL_DEBUG = false;

debug(LOCAL_DEBUG, "Chargement storage.js");


// services/storage.js

const STORAGE_KEY = "habitArray";
const DELETED_STORAGE_KEY = "deletedHabitsArray";



// Charger les habitudes
export function loadHabits() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// Chargement initial
export let habitArray = loadHabits();

// Sauvegarder
export function saveHabits() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(habitArray)
    );
}



// Charger les habitudes supprimées
export function loadDeletedHabits() {
    return JSON.parse(localStorage.getItem(DELETED_STORAGE_KEY)) || [];
}

// Chargement initial
export let deletedHabitsArray = loadDeletedHabits();

// Sauvegarder les habitudes supprimées
export function saveDeletedHabits() {
    localStorage.setItem(
        DELETED_STORAGE_KEY,
        JSON.stringify(deletedHabitsArray)
    );
}



// Ajouter une habitude
export function addHabit(habit) {
    habitArray.push(habit);

    saveHabits();
}



// Supprimer une habitude
export function deleteHabit(id) {

    habitArray = habitArray.filter(
        habit => habit.id !== id
    );

    saveHabits();
}



// Modifier une habitude
export function updateHabit(id, data) {

    const habit = habitArray.find(
        habit => habit.id === id
    );

    if (!habit) return;

    Object.assign(habit, data);

    saveHabits();
}

export function getHabit(id) {
    return habitArray.find(
        habit => habit.id === id
    );
}

export function clearHabits() {
    habitArray = [];

    saveHabits();
}


//AI made
// ---- Thème clair/sombre ----
// même clé que le script anti-flash inline dans le <head> des pages
const THEME_KEY = "axeTheme";

//AI made
// "light" par défaut : seul un choix explicite de l'utilisateur peut donner "dark"
export function loadTheme() {
    return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
}

//AI made
export function saveTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
}
