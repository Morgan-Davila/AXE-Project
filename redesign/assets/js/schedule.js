// AI made
// Bootstrap de la page Emploi du temps du prototype.
// calendar.js (l'app réelle) ne fait aujourd'hui que récupérer des
// références DOM : AXE 3 (agenda) n'est pas encore construit. Cette page
// est donc une illustration conceptuelle avec des évènements fictifs,
// pas un vrai calendrier branché sur des données.

import { initTheme } from "./theme.js";
import { initHeaderClock, initFooterYear, initRevealOnScroll } from "./effects.js";

initTheme();
initHeaderClock();
initFooterYear();

const previewNote = document.getElementById("previewNote");
if (previewNote) {
    previewNote.querySelector("span").textContent =
        "Aperçu conceptuel — l'agenda (AXE 3) n'est pas encore développé : ceci illustre une direction visuelle possible, avec des évènements fictifs.";
}

const START_HOUR = 7;
const END_HOUR = 21;
const ROW_HEIGHT = 64;
const DAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const MOCK_EVENTS = [
    { day: 0, start: 9, duration: 1, title: "Réunion d'équipe", sub: "Visio" },
    { day: 0, start: 18, duration: 0.75, title: "Course à pied", sub: "5 km", isHabit: true },
    { day: 1, start: 12.5, duration: 1, title: "Déjeuner avec Inès" },
    { day: 2, start: 9, duration: 2, title: "Bloc concentration", sub: "Projet AXE" },
    { day: 3, start: 19, duration: 1, title: "Lecture", sub: "20 pages", isHabit: true },
    { day: 4, start: 17, duration: 1.5, title: "Sport", sub: "Salle" },
    { day: 5, start: 10, duration: 1, title: "Ménage", sub: "Grand nettoyage" }
];

function startOfWeek(date) {
    const result = new Date(date);
    const day = result.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    result.setDate(result.getDate() + diffToMonday);
    result.setHours(0, 0, 0, 0);
    return result;
}

const grid = document.querySelector(".calendar__grid");
const body = document.querySelector(".calendar__body");
if (grid && body) {
    const monday = startOfWeek(new Date());
    const todayIndex = (new Date().getDay() + 6) % 7; // 0 = lundi

    // ---- Étiquettes des jours ----
    const corner = document.createElement("div");
    corner.className = "calendar__corner";
    grid.appendChild(corner);

    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);

        const label = document.createElement("div");
        label.className = "calendar__day-label" + (i === todayIndex ? " calendar__day-label--today" : "");
        label.innerHTML = `${DAY_LABELS[i]}<span>${date.getDate()}</span>`;
        grid.appendChild(label);
    }

    // ---- Gouttière des heures ----
    const hoursCount = END_HOUR - START_HOUR + 1;
    const totalHeight = hoursCount * ROW_HEIGHT;

    const hours = document.createElement("div");
    hours.className = "calendar__hours";

    for (let h = START_HOUR; h <= END_HOUR; h++) {
        const hourLabel = document.createElement("div");
        hourLabel.className = "calendar__hour";
        hourLabel.textContent = `${String(h).padStart(2, "0")}:00`;
        hours.appendChild(hourLabel);
    }
    body.appendChild(hours);

    // ---- Colonnes des jours + évènements ----
    for (let i = 0; i < 7; i++) {
        const col = document.createElement("div");
        col.className = "calendar__day-col" + (i === todayIndex ? " calendar__day-col--today" : "");
        col.style.height = `${totalHeight}px`;

        for (const event of MOCK_EVENTS.filter(e => e.day === i)) {
            const el = document.createElement("div");
            el.className = "calendar__event" + (event.isHabit ? " calendar__event--habit" : "");
            el.style.top = `${(event.start - START_HOUR) * ROW_HEIGHT + 2}px`;
            el.style.height = `${event.duration * ROW_HEIGHT - 4}px`;
            el.innerHTML = `<strong>${event.title}</strong>${event.sub ? event.sub : ""}`;
            col.appendChild(el);
        }

        body.appendChild(col);
    }

    // ---- Ligne "maintenant" ----
    const nowLine = document.createElement("div");
    nowLine.className = "calendar__now-line";
    body.appendChild(nowLine);

    function positionNowLine() {
        const now = new Date();
        const hourDecimal = now.getHours() + now.getMinutes() / 60;

        if (hourDecimal < START_HOUR || hourDecimal > END_HOUR) {
            nowLine.style.display = "none";
            return;
        }

        nowLine.style.display = "block";
        nowLine.style.top = `${(hourDecimal - START_HOUR) * ROW_HEIGHT}px`;
    }

    positionNowLine();
    setInterval(positionNowLine, 60000);
}

initRevealOnScroll();
