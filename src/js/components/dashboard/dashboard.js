const LOCAL_DEBUG = true;

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

        const lastExecution = new Date(Number(habit.executions?.at(-1) ?? habit.createdAt)); //si l'habit viens d'étre créé et qu'il n'y a pas encore d'éexecution, alors on utilise la date de création
        const now = new Date();

        // on ne veut sauter l'habit que si elle a une exécution reelle aujourd'hui, pas juste une date de création du jour
        const doneToday = habit.executions?.some(execution => isSameDay(Number(execution), now)) ?? false;

        if (!doneToday) {
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
                    const dayOfWeek = new Date().getDay();

                    if (habit.frequency.value.map(Number).includes(dayOfWeek)) {
                        renderRecalls(habit);
                    }
                    break;
                }

                case "monthly" : {
                    const dayOfMonth = new Date().getDate();

                    if (habit.frequency.value.map(Number).includes(dayOfMonth)) {
                        renderRecalls(habit);
                    }
                    break;
                }

            }
        }
    }
}