const LOCAL_DEBUG = false;

debug(LOCAL_DEBUG, "Chargement habitsSearchEvents.js");


import {
    getAllTypes
} from "./habits.js";

import {
    searchDateInput,
    searchTypeSelect,
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
export function setupSearchTypeDropdown () {

    if (!searchTypeSelect || !searchTypeOptions) return;

    searchTypeSelect.addEventListener("click", (event) => {
        event.stopPropagation();

        const isOpen = !searchTypeOptions.classList.contains("hiddenTypeProposition");

        if (isOpen) {
            searchTypeOptions.classList.add("hiddenTypeProposition");
            searchTypeSelect.setAttribute("aria-expanded", "false");
            return;
        }

        renderSearchTypeOptions(getAllTypes());
        searchTypeOptions.classList.remove("hiddenTypeProposition");
        searchTypeSelect.setAttribute("aria-expanded", "true");
    });

    searchTypeOptions.addEventListener("click", (event) => {
        const item = event.target.closest(".searchTypeOptions__item");

        if (!item) return;

        searchTypeSelect.textContent = item.textContent;
        searchTypeSelect.dataset.value = item.textContent;

        searchTypeOptions.classList.add("hiddenTypeProposition");
        searchTypeSelect.setAttribute("aria-expanded", "false");
        renderSearchTypeOptions(getAllTypes());
    });

    document.addEventListener("click", (event) => {
        if (searchTypeSelect.contains(event.target) || searchTypeOptions.contains(event.target)) return;

        searchTypeOptions.classList.add("hiddenTypeProposition");
        searchTypeSelect.setAttribute("aria-expanded", "false");
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
