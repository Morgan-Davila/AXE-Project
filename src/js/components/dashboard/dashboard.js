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

import { renderRecalls, recallPlace } from "./dashboardUI.js";

export function reactHabit (habitArray) {
    for (let habit of habitArray) {
        let type = habit.frequency.type;

        const lastExecution = new Date(Number(habit.executions?.at(-1) ?? habit.createdAt)); //si l'habit viens d'étre créé et qu'il n'y a pas encore d'éexecution, alors on utilise la date de création
        const now = new Date();

        // on ne veut sauter l'habit que si elle a une exécution reelle aujourd'hui, pas juste une date de création du jour
        const doneToday = habit.executions?.some(execution => isSameDay(Number(execution), now)) ?? false;

        let isDueToday = false;

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

                isDueToday = diffJours === interval;

                break;
            }

            case "weekly" : {
                const dayOfWeek = new Date().getDay();

                isDueToday = habit.frequency.value.map(Number).includes(dayOfWeek);
                break;
            }

            case "monthly" : {
                const dayOfMonth = new Date().getDate();

                isDueToday = habit.frequency.value.map(Number).includes(dayOfMonth);
                break;
            }
        }

        if (!isDueToday) continue;

        //AI made
        // on retrouve la carte déja rendue pour cet habit (s'il y en a une) au lieu d'en recréer une à chaque appel
        const existingCard = recallPlace?.querySelector(`[data-habit-id="${habit.id}"]`);

        if (doneToday) {
            existingCard?.classList.add("habits__cell--done");
        } else if (!existingCard) {
            renderRecalls(habit);
        }
    }
}