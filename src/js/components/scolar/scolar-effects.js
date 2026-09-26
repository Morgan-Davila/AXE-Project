const LOCAL_DEBUG = false;

debug(LOCAL_DEBUG, "Chargement scolar-effects"); //test

import {
    safeQuery,
    safeQueryAll,
    safeId,
    exists
} from "../../utils/dom.js"




export function setupFlashcardFlip() {
    const cards = safeQueryAll(".flashcard");

    cards.forEach(card => {
        card.addEventListener("click", () => {
            card.classList.toggle("flashcard--flipped");
        });
    });
}