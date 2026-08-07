const LOCAL_DEBUG = false;

debug(LOCAL_DEBUG, "Chargement storage.js");


// services/storage.js

const STORAGE_KEY = "habitArray";



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