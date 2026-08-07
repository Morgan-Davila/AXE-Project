//from debug.js
import  "./debug.js";

//from utils/date.js

import { updateHeader, updateFooter } from "./utils/date.js";
updateHeader();
setInterval(updateHeader, 1000);

updateFooter();

import {
    getFrequency
} from "./components/habits/habits.js"

getFrequency();

//from event.js
import { 
    setupHabitsPopup,
    setupHabitsForm,
    setupDurationPicker
} from "./components/habits/habitsEvents.js";

setupHabitsPopup();
setupHabitsForm();
setupDurationPicker();


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
