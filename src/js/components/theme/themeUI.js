//AI made
// Application du thème sur la page : attribut data-theme sur <html>, lu par _tokens.scss.

const LOCAL_DEBUG = false;

debug(LOCAL_DEBUG, "Chargement themeUI.js");



import { safeId } from "./../../utils/dom.js";



export const themeToggleButton = safeId("themeToggle");



//AI made
export function getCurrentTheme() {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}



//AI made
export function applyTheme(theme) {

    if (theme === "dark") {
        document.documentElement.dataset.theme = "dark";
    } else {
        delete document.documentElement.dataset.theme;
    }

    themeToggleButton?.setAttribute("aria-pressed", String(theme === "dark"));

    debug(LOCAL_DEBUG, "Thème appliqué :", theme);

}
