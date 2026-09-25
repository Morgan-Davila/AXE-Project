// AI made
// Point d'entrée unique du prototype de redesign, chargé par les 4 pages.
// Reprend le principe de src/js/main.js du vrai projet : les fonctions
// d'init de chaque page sont toutes appelées ici sans distinction ; celles
// dont le markup n'est pas présent sur la page courante se contentent de ne
// rien faire (voir le premier querySelector/getElementById de chaque
// fonction d'init).

import { initTheme } from "./theme.js";
import { initHeaderClock, initFooterYear, initRevealOnScroll } from "./effects.js";
import { getHabits } from "./data.js";
import { initDashboardPage } from "./dashboard.js";
import { initHabitsPage } from "./habits.js";

initTheme();
initHeaderClock();
initFooterYear();

const { habits, isDemo } = getHabits();

const previewNote = document.getElementById("previewNote");
if (previewNote) {
    previewNote.querySelector("span").textContent = isDemo
        ? "Aperçu avec des données de démonstration — ouvrez cette page depuis le même serveur que l'app pour voir vos vraies habitudes."
        : "Aperçu en lecture seule à partir de vos vraies habitudes : les actions sur cette page ne modifient jamais vos données enregistrées.";
}

initDashboardPage(habits);
initHabitsPage(habits);

initRevealOnScroll();
