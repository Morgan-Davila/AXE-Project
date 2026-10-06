const LOCAL_DEBUG = true;

debug(LOCAL_DEBUG, "Chargement scolarEvents.js"); //test

import {
    flashcardCreateButton,
    flashcardPopupOverlay,
    openFlashcardPopup,
    closeFlashcardPopup,
    isFlashcardPopupOpen,
    editableFlashcard,
    flashcardSwitchButton,
    flipFlashcard,
    saveFlashcardButton
} from "./scolarUI.js";

import { showEditorFace, editors } from "./flashcardsEditor.js";


//AI made : le bouton "Switch" retourne la carte éditable et passe l'éditeur sur l'autre face
export function setupFlashcardSwitch() {
    if (!flashcardSwitchButton || !editableFlashcard) return;

    flashcardSwitchButton.addEventListener("click", () => {
        const isBack = flipFlashcard(editableFlashcard, "editableFlashcard");
        flashcardSwitchButton.setAttribute("aria-pressed", String(isBack));
        showEditorFace(isBack ? "back" : "front");
    });
}


//AI made : ouverture/fermeture de la popup flashcard
export function setupFlashcardPopup() {

    // ouvrir la popup
    if (flashcardCreateButton) {
        flashcardCreateButton.addEventListener("click", () => {
            openFlashcardPopup();
        });
    }

    // fermer la popup en cliquant sur l'overlay (pas sur la popup elle-même)
    if (!flashcardPopupOverlay) return;

    flashcardPopupOverlay.addEventListener("click", (event) => {
        if (event.target === flashcardPopupOverlay) {
            closeFlashcardPopup();
        }
    });

    // fermer la popup avec Échap
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isFlashcardPopupOpen()) {
            closeFlashcardPopup();
        }
    });
}




export function setupFlashcardSaving () {
    if (!saveFlashcardButton) return;

    saveFlashcardButton.addEventListener("click", () => {
        const flashcard = {
            front: editors.front.getContents(),
            back: editors.back.getContents()
        };
        
        debug(LOCAL_DEBUG, flashcard)
    });
}
