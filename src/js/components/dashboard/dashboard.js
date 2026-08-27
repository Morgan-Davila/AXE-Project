const LOCAL_DEBUG = false;

debug(LOCAL_DEBUG, "Chargement dashboard.js");

import { habitArray } from "../../services/storage.js";
import {
    safeQuery,
    safeQueryAll,
    safeId
} from "./../../utils/dom.js"

import {
    isSameDay
} from "./../../utils/date.js"

import { renderRecalls } from "./dashboardUI.js";

export function reactHabit (habitArray) {
    for (let habit of habitArray) {
        let type = habit.frequency.type;

        const lastExecution = Number(habit.executions.at(-1) ?? habit.createdAt); //si l'habit viens d'étre créé et qu'il n'y a pas encore d'éexecution, alors on utilise la date de création
        const now = new Date();

        if (!isSameDay(lastExecution, now)) {
            switch (type) {
                case "interval" : {
                    const interval = Number(habit.frequency.value);
                    const day = lastExecution.getDay();

                    if (interval === day) {
                        renderRecalls(habit);
                    }

                    break;
                }

                case "weekly" : {

                    break;
                }

                case "monthly" : {

                    break;
                }

            }
        }
    }
}