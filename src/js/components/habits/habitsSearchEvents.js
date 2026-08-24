const LOCAL_DEBUG = false;

debug(LOCAL_DEBUG, "Chargement habitsSearchEvents.js");


import {
    searchTypes
} from "./habits.js";

import {
    searchDateInput,
    searchTypeSelect,
    searchTypeSelectLabel,
    searchTypeSearch,
    searchTypeInput,
    searchTypeOptions,
    renderSearchTypeOptions,
    openSearchHabitsPopup,
    closeSearchHabitsPopup,
    habitsCommandIcons,
    habitsPopupOverlay,
    searchHabitsPopupOverlay
} from "./habitsUI.js";


// bascule le champ de recherche par date entre texte ("Rechercher par date") et input date natif (jj/mm/aaaa) selon le focus
export function setupSearchDateInput () {

    if (!searchDateInput) return;

    searchDateInput.addEventListener("focus", () => {
        searchDateInput.type = "date";
    });

    searchDateInput.addEventListener("blur", () => {
        if (!searchDateInput.value) {
            searchDateInput.type = "text";
        }
    });

}


// menu déroulant custom pour la recherche par type
// bascule le bouton "Rechercher par type..." en barre de recherche dynamique tant que le menu est ouvert
function openSearchTypeDropdown () {
    searchTypeSelectLabel.classList.add("hiddenTypeSearch");
    searchTypeSearch.classList.remove("hiddenTypeSearch");

    searchTypeInput.value = "";
    searchTypeInput.focus();

    renderSearchTypeOptions(searchTypes(""));
    searchTypeOptions.classList.remove("hiddenTypeProposition");
    searchTypeSelect.setAttribute("aria-expanded", "true");
}

function closeSearchTypeDropdown () {
    searchTypeSearch.classList.add("hiddenTypeSearch");
    searchTypeSelectLabel.classList.remove("hiddenTypeSearch");

    searchTypeOptions.classList.add("hiddenTypeProposition");
    searchTypeSelect.setAttribute("aria-expanded", "false");
}

export function setupSearchTypeDropdown () {

    if (!searchTypeSelect || !searchTypeOptions || !searchTypeInput) return;

    searchTypeSelect.addEventListener("click", (event) => {
        event.stopPropagation();

        const isOpen = !searchTypeOptions.classList.contains("hiddenTypeProposition");

        if (isOpen) return; // le champ de recherche est déjà actif, on laisse l'utilisateur taper

        openSearchTypeDropdown();
    });

    searchTypeInput.addEventListener("input", () => {
        renderSearchTypeOptions(searchTypes(searchTypeInput.value));
    });

    searchTypeOptions.addEventListener("click", (event) => {
        const item = event.target.closest(".searchTypeOptions__item");

        if (!item) return;

        searchTypeSelectLabel.textContent = item.textContent;
        searchTypeSelect.dataset.value = item.textContent;

        closeSearchTypeDropdown();
    });

    document.addEventListener("click", (event) => {
        if (searchTypeSelect.contains(event.target) || searchTypeOptions.contains(event.target)) return;

        closeSearchTypeDropdown();
    });

}


export function setupPopupOverlay () {
    debug(LOCAL_DEBUG, habitsCommandIcons.search)
    debug(LOCAL_DEBUG, habitsPopupOverlay)
    
    habitsCommandIcons.search.addEventListener("click", () =>{
        openSearchHabitsPopup();
    });

    searchHabitsPopupOverlay.addEventListener("click", (event) =>{

        if (event.target === searchHabitsPopupOverlay) {
            closeSearchHabitsPopup();
        }
    });
}
