//from debug.js
import  "./debug.js";

//from utils/date.js

import { updateHeader, updateFooter } from "./utils/date.js";
updateHeader();
setInterval(updateHeader, 1000);

updateFooter();

import {
    getFrequency,
    setupTypePropositionSelection
} from "./components/habits/habits.js"

getFrequency();
setupTypePropositionSelection();

//from event.js
import {
    setupHabitsPopup,
    setupHabitsForm,
    setupDurationPicker,
    setupPopupTypePicker,
    setupHabitDeleteButton,
    setupHabitEditButton
} from "./components/habits/habitsEvents.js";

setupHabitsPopup();
setupHabitsForm();
setupDurationPicker();
setupPopupTypePicker();

import {
    setupSearchTypeDropdown,
    setupSearchLaunch,
    setupPopupOverlay
} from "./components/habits/habitsSearchEvents.js";


setupSearchTypeDropdown();
setupSearchLaunch();
setupPopupOverlay();



// global/habitsUI.js 
import {
    renderHabits,
    initTabs,
    renderMonthlyDays,
    frequencyMonthlyDays
} from "./components/habits/habitsUI.js"

renderHabits();
initTabs();
renderMonthlyDays();



document.addEventListener("DOMContentLoaded", () => {
    setupHabitDeleteButton();
    setupHabitEditButton();
});