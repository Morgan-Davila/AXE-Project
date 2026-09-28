const LOCAL_DEBUG = false;

debug(LOCAL_DEBUG, "Chargement scolarUI.js"); //test

import {
    safeQuery,
    safeQueryAll,
    safeId,
    exists
} from "../../utils/dom.js"

export const flashcardBox = safeQuery(".flashcardBox");


export function renderTestFlashCards (destination, amount) {
    let packet = [];
    for (let i = 0; i < amount ; i ++) {

        let flashcard = document.createElement("article");
        flashcard.classList.add("flashcard");

        let flashcardInner = document.createElement("div");
        flashcardInner.classList.add("flashcard__inner");

        let flashcardFront = document.createElement("div");
        flashcardFront.classList.add("flashcard__face");
        flashcardFront.classList.add("flashcard__face--front");
        flashcardFront.textContent = "Recto";

        let flashcardBack = document.createElement("div");
        flashcardBack.classList.add("flashcard__face");
        flashcardBack.classList.add("flashcard__face--back");
        flashcardBack.textContent = "Verso";

        flashcardInner.appendChild(flashcardFront);
        flashcardInner.appendChild(flashcardBack);

        flashcard.appendChild(flashcardInner);

        destination.appendChild(flashcard)
    }

}


export function setupFlashcardFlip() {
    const cards = safeQueryAll(".flashcard");

    cards.forEach(card => {
        card.addEventListener("click", () => {
            card.classList.toggle("flashcard--flipped");
        });
    });
}