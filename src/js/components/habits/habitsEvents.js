const LOCAL_DEBUG = true;

debug(LOCAL_DEBUG, "Chargement habitsEvents.js");


import {
    safeQuery,
    safeQueryAll,
    safeId
} from "./../../utils/dom.js";

import {
    createHabit,
    searchTypes
} from "./habits.js";

import {
    addHabit,
    deleteHabit
} from "./../../services/storage.js";

import {
    // variables
    renderHabits,
    habitsFormInput,
    habitsFormButton,
    habitsCommandButton,
    typeProposition,

    // functions
    habitsPopupOverlay,
    openHabitsPopup,
    closeHabitsPopup,
    renderTypesProposition,
    emptyPopup
} from "./habitsUI.js";


export function setupHabitDeleteButton () {

    const buttons = safeQueryAll(".habitCell__commands__button--delete");


    for (let button of buttons) {
        button.addEventListener("click", (event) => {
            const parent = event.target.closest("tr")
            
            const habitID = Number(parent.dataset.habitId)
            
            deleteHabit(habitID);
            
            parent.remove();
        });
    }
    
    
}

export function setupHabitEditButton () {
    const buttons = safeQueryAll(".habitCell__commands__button--edit");

    for (let button of buttons) {
        button.addEventListener("click", (event) => {
            habitPopupMode = "edit" ;

            const parent = event.target.closest("tr")
            
            const habitID = Number(parent.dataset.habitId)
            
            const habit = getHabit(habitID);

            openHabitsPopup();
            insertDataInHabitPopup(habit);
            

            habitsFormButton.textContent = "Modifier l'habitude";

            habitsFormButton.dataset.actualId = habitID;
        });
    }
}

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
        setupHabitDeleteButton();
        emptyPopup();
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


export function setupPopupTypePicker () {
    habitsFormInput.type.addEventListener("focus", () =>{
        debug(LOCAL_DEBUG, "Entré");

        typeProposition.classList.toggle("hiddenTypeProposition")
    });

    habitsFormInput.type.addEventListener("blur", () =>{
        debug(LOCAL_DEBUG, "Sortie");

        typeProposition.classList.toggle("hiddenTypeProposition")
    });


    typeProposition.addEventListener("mouseover", (event) => {
        const element = event.target.closest(".propositionCell");

        if (!element) return;

        debug(LOCAL_DEBUG, element.textContent);

        habitsFormInput.type.value = element.textContent;
    });

    habitsFormInput.type.addEventListener("input", () => {
        const value = habitsFormInput.type.value;
        debug(LOCAL_DEBUG, value)
        const types = searchTypes(value);
        
        renderTypesProposition(types)

    })
    
}



