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
                //AI made
                case "interval": {
                    const interval = Number(habit.frequency.value);

                    const today = new Date();
                    const msParDay = 1000 * 60 * 60 * 24;

                    // On neutralise les heures pour comparer des jours "propres"
                    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    const lastExecMidnight = new Date(
                        lastExecution.getFullYear(),
                        lastExecution.getMonth(),
                        lastExecution.getDate()
                    );

                    const diffJours = Math.round((todayMidnight - lastExecMidnight) / msParDay);

                    if (diffJours === interval) {
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