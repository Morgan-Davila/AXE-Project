import {
    safeQuery,
    safeQueryAll,
    safeId
} from "./../../utils/dom.js"

const LOCAL_DEBUG = true;

debug(LOCAL_DEBUG, "Chargement dashboardUI.js");

export const recallPlace = safeQuery(".habits");


export function renderRecalls (data) {
    const name = data.name;
    const streak = Number(data.streak);
    

    const recall = document.createElement("article");
    recall.classList.add("habits__cell")

    const title = document.createElement("p");
    title.classList.add("habits__cell__title");
    title.innerText = name;

    const right = document.createElement("div");
    right.classList.add("habits__cell--right");
    const rightContent = `
        <span class="habits__cell__streak">${streak}🔥</span>

        <div class="habits__cell__checkmark">
            <label class="container">
                <input type="checkbox">
                <div class="checkmark"></div>
            </label>
        </div>
    `
    right.innerHTML = rightContent;

    recall.appendChild(title);
    recall.appendChild(right);

    recall.dataset.habitId = data.id ;

    recallPlace?.appendChild(recall);
}


// export const checkboxRecalls = safeQueryAll(".habits__cell__checkmark");
// debug(LOCAL_DEBUG, checkboxRecalls);
