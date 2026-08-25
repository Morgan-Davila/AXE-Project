const LOCAL_DEBUG = true;

debug(LOCAL_DEBUG, "Chargement habits.js"); //test

import { habitArray } from "../../services/storage.js";
import {
    safeQuery,
    safeQueryAll,
    safeId,
    exists
} from "./../../utils/dom.js"
import { renderTypesProposition } from "./habitsUI.js";


let typesArray = [];


//cette fonction se charge de récuperer la durée dans l'input et de transformer cette valeur en nombre utilisable
export function getDuration() {

    const input = safeId("durationInput");
    const unit = safeId("durationUnit");

    let duration = {
        unit: 0,
        value: 0
    };

    // Sécurité
    if (!input || !unit) return duration;

    const value = Number(input.value);
    const multiplier = Number(unit.value);

    // Vérification
    if (!value || value <= 0) return duration;

    duration.unit = multiplier;
    duration.value = value * multiplier;

    return duration;

}
//cette fonction générique récupère tout les chceckbox:checked dans un espace donné (form) qui portent un selector précis (selector)
//Cette fonction doit etre mise dans un autre endroit a l'avenir
function getCheckedCheckboxValues(form, selector) {
    return [...safeQueryAll(selector + ":checked", form)]
        .map(checkbox => Number(checkbox.value));
}


export function getFrequency() {
    const tabs = {
        interval : safeId("tab1"),
        weekly : safeId("tab2"),
        monthly : safeId("tab3")
    }

    const tab = safeQuery(".tab.activeTabs").dataset.tab;

    debug(LOCAL_DEBUG, tab);

    let frequency = {}

    switch (tab) {
        case tabs.interval.id : {
            frequency.value = Number(
                safeQuery(".frequency-interval__input").value
            );
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
    typesArray.push(data.type);
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

export function editHabit (data) {
    return {
        name: data.name,

        type: data.type,

        frequency: getFrequency(),

        duration: getDuration(),
    };
}






export function setupTypePropositionSelection () {
    document.addEventListener("DOMContentLoaded", () => {
        

        for (let habit of habitArray) {
            if (!typesArray.includes(habit.type)) {
                typesArray.push(habit.type);
            }
        }
        debug(LOCAL_DEBUG, typesArray)


        renderTypesProposition(typesArray); //initial rendering
    })
}

export function getAllTypes() {
    debug(LOCAL_DEBUG, typesArray)
    return typesArray;
}

//AI made
// normalisation et standardisation du texte pour une recherche insensible aux accents/casse
function normalizeSearchText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, "");
}

//AI made
export function searchTypes(search) {
    const input = normalizeSearchText(search);

    const results = typesArray
        .filter(type => normalizeSearchText(type).includes(input))
        .slice(0, 5);

    return results;
}

//AI made
// recherche d'habitudes par nom (texte libre) et par type (correspondance exacte, optionnelle)
export function searchHabits(name, type) {
    const input = normalizeSearchText(name || "");

    return habitArray.filter(habit => {
        const matchesName = normalizeSearchText(habit.name).includes(input);
        const matchesType = !type || habit.type === type;

        return matchesName && matchesType;
    });
}