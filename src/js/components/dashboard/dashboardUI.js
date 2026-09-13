import {
    safeQuery,
    safeQueryAll,
    safeId
} from "./../../utils/dom.js"

const LOCAL_DEBUG = true;

debug(LOCAL_DEBUG, "Chargement dashboardUI.js");

export const recallPlace = safeQuery(".habits");


export function renderRecalls (dataArray, isDone) {
    for (let data of dataArray) {
        const name = data.name;
        const streak = Number(data.streak);

        const recall = document.createElement("article");
        recall.classList.add("habits__cell");
        if (isDone) recall.classList.add("habits__cell--done");

        const title = document.createElement("p");
        title.classList.add("habits__cell__title");
        title.innerText = name;

        const right = document.createElement("div");
        right.classList.add("habits__cell--right");

        const streakSpan = document.createElement("span");
        streakSpan.classList.add("habits__cell__streak");
        streakSpan.innerText = `${streak}🔥`;

        const checkmarkWrapper = document.createElement("div");
        checkmarkWrapper.classList.add("habits__cell__checkmark");

        const label = document.createElement("label");
        label.classList.add("container");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = isDone;
        checkbox.disabled = isDone;

        const checkmark = document.createElement("div");
        checkmark.classList.add("checkmark");

        label.appendChild(checkbox);
        label.appendChild(checkmark);

        checkmarkWrapper.appendChild(label);

        right.appendChild(streakSpan);
        right.appendChild(checkmarkWrapper);

        recall.appendChild(title);
        recall.appendChild(right);

        recall.dataset.habitId = data.id;

        recallPlace?.appendChild(recall);
    }
}


// export const checkboxRecalls = safeQueryAll(".habits__cell__checkmark");
// debug(LOCAL_DEBUG, checkboxRecalls);
