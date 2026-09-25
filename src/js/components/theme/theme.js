//AI made
// Logique du thème clair/sombre (aucun accès au DOM ici).

const LOCAL_DEBUG = false;

debug(LOCAL_DEBUG, "Chargement theme.js");



//AI made
export function getNextTheme(currentTheme) {
    return currentTheme === "dark" ? "light" : "dark";
}
