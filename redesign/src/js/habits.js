// AI made
// Bootstrap de la page Gestionnaire d'habitudes du prototype.
// La popup de création/édition et la popup de recherche gardent LEUR design
// actuel (non retouché, cf. components.css) : le script ci-dessous se
// contente de les ouvrir/fermer comme le fait l'app aujourd'hui, sans
// réimplémenter la logique de création/édition/recherche réelle. Supprimer
// une ligne ici ne retire l'habitude que de cet aperçu, jamais du
// localStorage réel.

import { initTheme } from "./theme.js";
import { initHeaderClock, initFooterYear, showToast } from "./effects.js";
import { getHabits, translateFrequency, formatDuration } from "./data.js";

initTheme();
initHeaderClock();
initFooterYear();

const { habits: initialHabits, isDemo } = getHabits();
let habits = [...initialHabits];

const previewNote = document.getElementById("previewNote");
if (previewNote) {
    previewNote.querySelector("span").textContent = isDemo
        ? "Aperçu avec des données de démonstration — ouvrez cette page depuis le même serveur que l'app pour voir vos vraies habitudes."
        : "Vos habitudes réelles sont listées en lecture seule : éditer/supprimer ici n'affecte que cet aperçu, jamais vos données enregistrées.";
}

const EDIT_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>`;
const DELETE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;

const habitCellZone = document.getElementById("habitCellZone");

function buildRow(habit) {
    const tr = document.createElement("tr");
    tr.className = "habitCell";
    tr.dataset.habitId = habit.id;

    const name = document.createElement("td");
    name.className = "habitCell__name";
    name.textContent = habit.name;

    const type = document.createElement("td");
    type.className = "habitCell__type";
    type.textContent = habit.type;

    const frequency = document.createElement("td");
    frequency.className = "habitCell__frequency";
    frequency.textContent = translateFrequency(habit);

    const duration = document.createElement("td");
    duration.className = "habitCell__duration";
    duration.textContent = formatDuration(habit.duration?.value);

    const commands = document.createElement("div");
    commands.className = "habitCell__commands";

    const edit = document.createElement("div");
    edit.className = "habitCell__commands__button habitCell__commands__button--edit";
    edit.innerHTML = EDIT_ICON;
    edit.dataset.action = "edit";

    const del = document.createElement("div");
    del.className = "habitCell__commands__button habitCell__commands__button--delete";
    del.innerHTML = DELETE_ICON;
    del.dataset.action = "delete";

    commands.append(edit, del);
    duration.appendChild(commands);

    tr.append(name, type, frequency, duration);
    return tr;
}

function renderTable() {
    if (!habitCellZone) return;

    habitCellZone.innerHTML = "";

    if (habits.length === 0) {
        const emptyRow = document.createElement("tr");
        const emptyCell = document.createElement("td");
        emptyCell.colSpan = 4;
        emptyCell.className = "habitManager__empty";
        emptyCell.textContent = "Aucune habitude enregistrée pour le moment.";
        emptyRow.appendChild(emptyCell);
        habitCellZone.appendChild(emptyRow);
        return;
    }

    for (const habit of habits) {
        habitCellZone.appendChild(buildRow(habit));
    }
}

renderTable();

habitCellZone?.addEventListener("click", (event) => {
    const editButton = event.target.closest(".habitCell__commands__button--edit");
    const deleteButton = event.target.closest(".habitCell__commands__button--delete");

    if (editButton) {
        openLegacyPopup(habitPopupOverlay, "La popup d'édition garde son design actuel — on la reprendra plus tard.");
        return;
    }

    if (deleteButton) {
        const row = deleteButton.closest(".habitCell");
        const habitId = row?.dataset.habitId;

        habits = habits.filter(h => String(h.id) !== habitId);

        row.classList.add("habitCell--removing");
        row.addEventListener("transitionend", () => renderTable(), { once: true });

        showToast("Aperçu — habitude retirée de cet aperçu uniquement.");
    }
});

// ---- Popups existantes : ouverture/fermeture identique à l'app actuelle,
// sans réimplémenter la création/édition/recherche elle-même. ----

const habitPopupOverlay = document.querySelector(".habitPopupOverlay");
const searchPopupOverlay = document.querySelector(".searchHabitPopupOverlay");
const habitFormButton = document.getElementById("habitFormButton");
const newHabitButtons = [
    document.querySelector(".habitManagerMenu__menu"),
    document.querySelector(".habitManager__table__button")
];
const searchIcon = document.getElementById("habitManagerMenu__icons--search");

function openLegacyPopup(overlay, message) {
    if (!overlay) return;
    overlay.classList.remove("hiddenPopup", "hiddenSearchPopup");
    if (message) showToast(message);
}

function closeLegacyPopup(overlay, hiddenClass) {
    overlay?.classList.add(hiddenClass);
}

for (const button of newHabitButtons) {
    button?.addEventListener("click", () => {
        openLegacyPopup(habitPopupOverlay, "La popup de création garde son design actuel — on la reprendra plus tard.");
    });
}

habitPopupOverlay?.addEventListener("click", (event) => {
    if (event.target === habitPopupOverlay) closeLegacyPopup(habitPopupOverlay, "hiddenPopup");
});

habitFormButton?.addEventListener("click", (event) => {
    event.preventDefault();
    closeLegacyPopup(habitPopupOverlay, "hiddenPopup");
    showToast("Aperçu — la création réelle sera branchée quand la popup sera redessinée.");
});

searchIcon?.addEventListener("click", () => {
    openLegacyPopup(searchPopupOverlay, "La recherche garde son design actuel — on la reprendra plus tard.");
});

searchPopupOverlay?.addEventListener("click", (event) => {
    if (event.target === searchPopupOverlay) closeLegacyPopup(searchPopupOverlay, "hiddenSearchPopup");
});
