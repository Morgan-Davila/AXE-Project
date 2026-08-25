const LOCAL_DEBUG = false;

debug(LOCAL_DEBUG, "Chargement habitsSearchEvents.js");


import {
    searchTypes,
    searchHabits
} from "../habits.js";

import {
    habitsCommandIcons,
    habitsPopupOverlay
} from "../habitsUI.js";

import {
    searchHabitInput,
    searchLaunchButton,
    searchTypeSelect,
    searchTypeSelectLabel,
    searchTypeSearch,
    searchTypeInput,
    searchTypeOptions,
    renderSearchTypeOptions,
    renderSearchResults,
    openSearchHabitsPopup,
    closeSearchHabitsPopup,
    searchHabitsPopupOverlay
} from "./habitsSearchUI.js";


// menu déroulant custom pour la recherche par type
//AI made
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

//AI made
function closeSearchTypeDropdown () {
    searchTypeSearch.classList.add("hiddenTypeSearch");
    searchTypeSelectLabel.classList.remove("hiddenTypeSearch");

    searchTypeOptions.classList.add("hiddenTypeProposition");
    searchTypeSelect.setAttribute("aria-expanded", "false");
}

//AI made
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
        const reset = event.target.closest(".searchTypeOptions__reset");

        if (reset) {
            searchTypeSelectLabel.textContent = "Rechercher par type...";
            delete searchTypeSelect.dataset.value;

            closeSearchTypeDropdown();
            return;
        }

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


//AI made
// exécute la recherche (nom + type) et affiche les résultats
export function setupSearchLaunch () {

    if (!searchLaunchButton || !searchHabitInput) return;

    const runSearch = () => {
        const results = searchHabits(searchHabitInput.value, searchTypeSelect.dataset.value);
        renderSearchResults(results);
    };

    searchLaunchButton.addEventListener("click", runSearch);

    searchHabitInput.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;

        event.preventDefault();
        runSearch();
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
