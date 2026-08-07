const LOCAL_DEBUG = true;

debug(LOCAL_DEBUG, "Chargement habits.js"); //test

import {
    safeQuery,
    safeQueryAll,
    safeId,
    exists
} from "./../../utils/dom.js"





//cette fonction se charge de récuperer la durée dans l'input et de transformer cette valeur en nombre utilisable
export function getDuration() {

    const input = document.querySelector("#durationInput");
    const unit = document.querySelector("#durationUnit");


    // Sécurité
    if (!input || !unit) return null;


    const value = Number(input.value);
    const multiplier = Number(unit.value);


    // Vérification
    if (!value || value <= 0) return null;


    return value * multiplier;

}
//cette fonction générique récupère tout les chceckbox:checked dans un espace donné (form) qui portent un selector précis (selector)
//Cette fonction doit etre mise dans un autre endroit a l'avenir
function getCheckedCheckboxValues(form, selector) {
    return [...form.querySelectorAll(selector + ":checked")]
        .map(checkbox => Number(checkbox.value));
}


export function getFrequency() {
    const tabs = {
        interval : document.getElementById("tab1"),
        weekly : document.getElementById("tab2"),
        monthly : document.getElementById("tab3")
    }

    const tab = document.querySelector(".tab.activeTabs").dataset.tab;

    debug(LOCAL_DEBUG, tab);

    let frequency = {}

    switch (tab) {
        case tabs.interval.id : {
            frequency.value = document.querySelector(".frequency-interval__input").value;
            frequency.type = "interval"
            break;
        }

        case tabs.weekly.id : {
            const form = tabs.weekly;
            frequency.value = getCheckedCheckboxValues(form, ".inp-cbx")
            frequency.type = "weekly"
            break;
        }

        case tabs.monthly.id : {
            const form = tabs.monthly;
            frequency.value = getCheckedCheckboxValues(form, ".inp-cbx");
            frequency.type = "monthly";
            break;
        }

        default : {
            frequency.value = null;
            frequency.type = null;
        }
    }

    return frequency;
}








//cette fonction de charge de créer une habit
export function createHabit(data){
    return {
        id: Date.now(),

        name: data.name,

        type: data.type,

        frequency: getFrequency(),

        duration: getDuration(),

        streak: 0,

        createdAt: Date.now()
    };
}