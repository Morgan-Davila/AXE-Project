const LOCAL_DEBUG = true;

debug(LOCAL_DEBUG, "Chargement habitsUI.js");



import { 
    formatDuration,
    joinFrench,
    translateFrequency
} from "../../utils/format.js";

import {
    habitArray
} from "./../../services/storage.js"


import {
    safeQuery,
    safeQueryAll,
    safeId,
    exists
} from "./../../utils/dom.js"




// données du gestionnaire d'habitudes
export const habitsCommandIcons = {
    settings : safeId("habitManagerMenu__icons--settings"),
    filter : safeId("habitManagerMenu__icons--filter"),
    search : safeId("habitManagerMenu__icons--search")
}


// les deux boutons pour créer une habit
export const habitsCommandButton = [
    safeQuery(".habitManagerMenu__menu"),
    safeQuery(".habitManager__table__button")
]


// popup dans le habitManager
export const habitsPopupOverlay = safeQuery(".habitPopupOverlay");

// gestion du form de la popup
export const habitsFormInput = {
    name : safeId("inputName"),
    type : safeId("inputType")
}



export const typeProposition = safeId("typeProposition");

export const habitsFormButton = safeId("habitFormButton");

// recherche d'habitudes
export const searchDateInput = safeId("searchDateInput");

export const searchResultsZone = safeId("searchResultsZone");

export const searchTypeSelect = safeId("searchTypeSelect");

export const searchTypeOptions = safeId("searchTypeOptions");

export const searchHabitsPopupOverlay = safeQuery(".searchHabitPopupOverlay");

// création des habitCell
export function renderHabits () {

    const habitCellZone = safeId("habitCellZone");

    if (!habitCellZone) return;

    habitCellZone.innerHTML = ""; // reset

    for (let habit of habitArray) {

        // création de l'habitCell
        let habitCell = document.createElement("tr");
        habitCell.classList.add("habitCell");
        habitCell.dataset.habitId = habit.id

        let name = document.createElement("td");
        name.classList.add("habitCell__name");
        name.textContent = habit.name;

        let type = document.createElement("td");
        type.classList.add("habitCell__type");
        type.textContent = habit.type;

        let frequency = document.createElement("td");
        frequency.classList.add("habitCell__frequency");
        frequency.textContent = translateFrequency(habit);

        let duration = document.createElement("td");
        duration.classList.add("habitCell__duration");
        duration.textContent = formatDuration(habit.duration.value);

        let commands = document.createElement("div");
        commands.classList.add("habitCell__commands");

        let edit = document.createElement("div");
        edit.classList.add("habitCell__commands__button");
        edit.classList.add("habitCell__commands__button--edit");
        edit.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=""><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>`
        edit.dataset.action = "edit";

        let del = document.createElement("div");
        del.classList.add("habitCell__commands__button");
        del.classList.add("habitCell__commands__button--delete");
        del.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`
        del.dataset.action = "delete";

        commands.appendChild(edit);
        commands.appendChild(del);

        duration.appendChild(commands);

        // rassemblement des td
        habitCell.appendChild(name);
        habitCell.appendChild(type);
        habitCell.appendChild(frequency);
        habitCell.appendChild(duration);

        habitCellZone.appendChild(habitCell);



    }
}

//AI maded
export function emptyPopup() {

    // Reset des inputs texte
    habitsFormInput.name.value = "";
    habitsFormInput.type.value = "";

    // Reset de la fréquence "tous les X jours"
    const frequencyIntervalInput = safeQuery(".frequency-interval__input");

    if (frequencyIntervalInput) {
        frequencyIntervalInput.value = "";
    }

    // Reset de toutes les checkbox
    const checkboxes = safeQueryAll(".inp-cbx", habitsPopupOverlay);

    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset des propositions de type
    if (habitsFormInput.type) {
        habitsFormInput.type.innerHTML = "";
    }

    // Reset de la durée
    const durationInput = safeId("durationInput");
    const durationUnit = safeId("durationUnit");

    if (durationInput) {
        durationInput.value = "";
    }

    if (durationUnit) {
        durationUnit.value = "60";
    }

    // Reset des boutons de durée
    const durationOptions = safeQueryAll(
        ".duration-option",
        habitsPopupOverlay
    );

    durationOptions.forEach(option => {
        option.classList.remove("durationActive");
    });

    // Reset des tabs
    const tabs = safeQueryAll(".tab", habitsPopupOverlay);
    const contents = safeQueryAll(".tab-content", habitsPopupOverlay);

    tabs.forEach(tab => {
        tab.classList.remove("activeTabs");
    });

    contents.forEach(content => {
        content.classList.remove("activeTabs");
    });

    // Remettre le premier tab actif
    const firstTab = tabs[0];

    if (firstTab) {
        firstTab.classList.add("activeTabs");

        const target = safeQuery(
            "#" + firstTab.dataset.tab,
            habitsPopupOverlay
        );

        if (target) {
            target.classList.add("activeTabs");
        }
    }
}


// ouvrir et fermer la popup
export function openHabitsPopup () {
    if (!habitsPopupOverlay) return;
    habitsFormButton.textContent = "Créer l'habitude";
    emptyPopup();
    habitsPopupOverlay.classList.remove("hiddenPopup");
}



export function closeHabitsPopup () {
    if (!habitsPopupOverlay) return;
    habitsPopupOverlay.classList.add("hiddenPopup");
}


// gestion des tabs de fréquence
export function initTabs(selector = ".tabs") {

    const root = safeQuery(selector);

    if (!root) return;

    const tabs = safeQueryAll(".tab", root);
    const contents = safeQueryAll(".tab-content", root);

    debug(LOCAL_DEBUG, tabs, contents);

    tabs.forEach(tab => {
        tab.addEventListener("click", (event) => {
            event.preventDefault();

            // reset tabs
            tabs.forEach(t => t.classList.remove("activeTabs"));
            contents.forEach(c => c.classList.remove("activeTabs"));

            // activation du tab
            tab.classList.add("activeTabs");

            const target = safeQuery("#" + tab.dataset.tab, root);

            if (target) {
                target.classList.add("activeTabs");
            }
        });
    });
}



export const frequencyMonthlyDays = safeQuery(".frequency-monthly__days");

// Charge les jours du mois et les checkbox
export function renderMonthlyDays() {

    if (!frequencyMonthlyDays) return;

    frequencyMonthlyDays.innerHTML = "";

    for (let day = 1; day <= 31; day++) {

        frequencyMonthlyDays.insertAdjacentHTML("beforeend", `
            <div class="checkbox-wrapper-4">
                <input
                    class="inp-cbx"
                    id="day${day}"
                    type="checkbox"
                    value="${day}"
                >
                <label class="cbx" for="day${day}">
                    <span>
                        <svg width="12px" height="10px">
                            <use href="#check-4"></use>
                        </svg>
                    </span>
                    <span>${day}</span>
                </label>
            </div>
        `);

    }

}

export function renderTypesProposition (propositions) {
    typeProposition.innerHTML = " "

    for (let proposition of propositions) {
        const div = document.createElement("div");
        div.classList.add("propositionCell");
        div.textContent = proposition;

        typeProposition.appendChild(div);
    }
}


// remplit la liste déroulante custom de recherche par type
export function renderSearchTypeOptions (types) {

    if (!searchTypeOptions) return;

    searchTypeOptions.innerHTML = "";

    for (let type of types) {
        const item = document.createElement("div");
        item.classList.add("searchTypeOptions__item");
        item.setAttribute("role", "option");
        item.textContent = type;

        searchTypeOptions.appendChild(item);
    }
}



export function insertDataInHabitPopup (data) {

    emptyPopup();    
    const intervalTabInput = safeQuery(".frequency-interval__row input");


    habitsFormInput.name.value = data.name;

    const tabButtons = safeQueryAll(".tab");
    const tabContents = safeQueryAll(".tab-content");

    let tabButton
    let tab

    switch (data.frequency.type) {
        case "interval" : 
            tabButton = safeQuery(`.tab[data-tab="tab1"]`);
            tab = safeId('tab1');
        break

        case "weekly" : 
            tabButton = safeQuery(`.tab[data-tab="tab2"]`);
            tab = safeId('tab2');
        break

        case "monthly" : 
            tabButton = safeQuery(`.tab[data-tab="tab3"]`);
            tab = safeId('tab3');
        break
    }
    
    for (let button of tabButtons) {
        button.classList.remove("activeTabs")
    }
    for (let content of tabContents) {
        content.classList.remove("activeTabs")
    }

    tabButton.classList.add("activeTabs");
    tab.classList.add("activeTabs");

    switch (data.frequency.type) {
        case "interval" : {
            intervalTabInput.value = Number(data.frequency.value);
            break
        }

        case "weekly" : {
            const checkboxes = safeQueryAll(".frequency-weekly__grid .inp-cbx");

            for (let checkbox of checkboxes) {
                for (let value of data.frequency.value) {
                    if (Number(checkbox.value) === Number(value)) {
                        checkbox.checked = true;
                    }
                }
            }
            break;
        }

        case "monthly" : {
            const checkboxes = safeQueryAll(".frequency-monthly__days .inp-cbx");

            for (let checkbox of checkboxes) {
                for (let value of data.frequency.value) {
                    if (Number(checkbox.value) === Number(value)) {
                        checkbox.checked = true;
                    }
                }
            }
            break
        }
    }

    habitsFormInput.type.value = data.type;

    const durationInput = safeId("durationInput");
    const durationValue = Number(data.duration.value);
    const durationUnit = Number(data.duration.unit);

    durationInput.value = durationValue / durationUnit;
}