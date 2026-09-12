const LOCAL_DEBUG = true;

debug(LOCAL_DEBUG, "Chargement dashboardEvents.js");

import { getHabit, habitArray, updateHabit } from "../../services/storage.js";
import {
    safeQuery,
    safeQueryAll,
    safeId
} from "./../../utils/dom.js"
import { reactHabit } from "./dashboard.js";

// import { checkboxRecalls } from "./dashboardUI.js";


export function setupRecallsCheckmarks () {
    const checkboxRecalls = safeQueryAll(".habits__cell__checkmark");
    debug(LOCAL_DEBUG, checkboxRecalls)

    for (let checkmark of checkboxRecalls) {
        const checkbox = checkmark.querySelector("input[type='checkbox']");

        checkbox.addEventListener("change", (event) => {
            const checkmarkArticle = event.currentTarget.closest(".habits__cell");
            const checkmarkId = Number(checkmarkArticle.dataset.habitId);

            // debug(LOCAL_DEBUG, checkmarkArticle)
            // debug(LOCAL_DEBUG, checkmarkId)
            const timestamp = Date.now();

            const habit = getHabit(checkmarkId);
            habit.executions.push(timestamp);
            habit.streak += 1;

            updateHabit(checkmarkId, habit);
            reactHabit(habitArray);
        });
    }
}