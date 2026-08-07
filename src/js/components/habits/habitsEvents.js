const LOCAL_DEBUG = false;

debug(LOCAL_DEBUG, "Chargement habitsEvents.js");


import {
    safeQuery,
    safeQueryAll,
    safeId
} from "./../../utils/dom.js";

import {
    createHabit
} from "./habits.js";

import {
    addHabit
} from "./../../services/storage.js";

import {
    // variables
    renderHabits,
    habitsFormInput,
    habitsFormButton,
    habitsCommandButton,

    // functions
    habitsPopupOverlay,
    openHabitsPopup,
    closeHabitsPopup
} from "./habitsUI.js";

// gestion du bouton submit du form de la popup
export function setupHabitsForm() {

    if (!habitsFormButton) return;

    habitsFormButton.addEventListener("click", (event) => {

        event.preventDefault();

        let data = {};

        for (let key in habitsFormInput) {

            if (!habitsFormInput[key]) continue; //Si cette valeur n'existe pas (undefined, null, false, etc.), on passe directement à l'itération suivante.

            data[key] = habitsFormInput[key].value;

        }

        debug(LOCAL_DEBUG, data);

        const habit = createHabit(data);

        debug(LOCAL_DEBUG, habit);
        addHabit(habit);
        renderHabits();
        closeHabitsPopup();
    });

}

// gérer la popup
export function setupHabitsPopup() {

    // ouvrir la popup
    for (const button of habitsCommandButton) {

        if (!button) continue;

        button.addEventListener("click", () => {
            openHabitsPopup();
        });

    }

    // fermer la popup
    if (!habitsPopupOverlay) return;

    habitsPopupOverlay.addEventListener("click", (event) => {

        if (event.target === habitsPopupOverlay) {
            closeHabitsPopup();
        }

    });

}

// cette fonction met à jour la durée lorsqu'on clique sur une proposition
export function setupDurationPicker() {

    const options = safeQueryAll(".duration-option");
    const input = safeId("durationInput");


    if (!input || options.length === 0) return;


    options.forEach(option => {

        option.addEventListener("click", () => {

            // retirer la sélection précédente
            options.forEach(option => {
                option.classList.remove("durationActive");
            });


            // ajouter la sélection actuelle
            option.classList.add("durationActive");


            // mettre la valeur dans l'input
            input.value = Number(option.dataset.duration) / 60;

        });

    });

}