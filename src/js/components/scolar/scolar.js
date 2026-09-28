const LOCAL_DEBUG = false;

debug(LOCAL_DEBUG, "Chargement scolar.js"); //test

import {
    safeQuery,
    safeQueryAll,
    safeId,
    exists
} from "../../utils/dom.js"

import { flashcardBox, renderTestFlashCards } from "./scolarUI.js";


export function setupFlashcard () {
    //lancement des flashcards de test
    renderTestFlashCards(flashcardBox, 5);
}