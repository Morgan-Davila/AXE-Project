// AI made
// Bascule clair/sombre du prototype. Persistée sous une clé dédiée
// ("axeRedesignTheme"), distincte de "habitArray" : n'a aucune interaction
// avec le stockage de l'app réelle.

const THEME_KEY = "axeRedesignTheme";

function applyTheme(theme) {
    if (theme === "dark" || theme === "light") {
        document.documentElement.dataset.theme = theme;
    } else {
        delete document.documentElement.dataset.theme;
    }
}

export function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    applyTheme(saved);

    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
        // le clair est le défaut : seul un choix explicite précédent peut être "dark"
        const current = document.documentElement.dataset.theme || "light";
        const next = current === "dark" ? "light" : "dark";

        applyTheme(next);
        localStorage.setItem(THEME_KEY, next);
    });
}
