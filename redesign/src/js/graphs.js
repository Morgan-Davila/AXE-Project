// AI made
// Bootstrap de la page Graphiques & stats du prototype.
// La page réelle (graphs-stats.html) est aujourd'hui vide — AXE 2 n'a pas
// commencé. Tout ce qui suit est donc une proposition de ce à quoi cette
// page pourrait ressembler, calculée à partir de vraies habitudes quand
// elles existent (lecture seule, jamais écrite).

import { initTheme } from "./theme.js";
import { initHeaderClock, initFooterYear, initRevealOnScroll, countUp } from "./effects.js";
import {
    getHabits,
    computeStatTiles,
    computeDailyCompletions,
    computeHeatmap,
    computeStreakLeaderboard
} from "./data.js";

initTheme();
initHeaderClock();
initFooterYear();

const { habits, isDemo } = getHabits();

const previewNote = document.getElementById("previewNote");
if (previewNote) {
    previewNote.querySelector("span").textContent = isDemo
        ? "Aperçu avec des données de démonstration — ouvrez cette page depuis le même serveur que l'app pour voir vos vraies statistiques."
        : "Statistiques calculées à partir de vos habitudes réelles, en lecture seule.";
}

// ---- Tuiles chiffrées ----

const stats = computeStatTiles(habits);

const tileTotal = document.getElementById("tileTotal");
const tileToday = document.getElementById("tileToday");
const tileStreak = document.getElementById("tileStreak");
const tileStreakName = document.getElementById("tileStreakName");
const tileWeek = document.getElementById("tileWeek");

if (tileTotal) countUp(tileTotal, stats.total);
if (tileToday) tileToday.textContent = `${stats.doneToday}/${stats.totalToday}`;
if (tileStreak) countUp(tileStreak, stats.bestStreak, { suffix: " 🔥" });
if (tileStreakName) tileStreakName.textContent = stats.bestStreakName;
if (tileWeek) countUp(tileWeek, stats.completions7d);

// ---- Graphique 14 jours (Chart.js) ----

const chartCanvas = document.getElementById("statsWeeklyChart");

if (chartCanvas && window.Chart) {
    const days = 14;
    const counts = computeDailyCompletions(habits, days);
    const labels = new Array(days).fill(0).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (days - 1 - i));
        return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
    });

    const rootStyles = getComputedStyle(document.documentElement);
    const accent = rootStyles.getPropertyValue("--accent").trim() || "#0F52BA";

    new window.Chart(chartCanvas, {
        type: "line",
        data: {
            labels,
            datasets: [{
                data: counts,
                borderColor: accent,
                backgroundColor: `${accent}22`,
                fill: true,
                tension: 0.35,
                pointRadius: 3,
                pointBackgroundColor: accent
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { maxTicksLimit: 7 } },
                y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: rootStyles.getPropertyValue("--border").trim() } }
            }
        }
    });
}

// ---- Classement des séries ----

const leaderboard = document.getElementById("statsLeaderboard");

if (leaderboard) {
    const top = computeStreakLeaderboard(habits, 5);
    const max = Math.max(1, ...top.map(h => Number(h.streak ?? 0)));

    leaderboard.innerHTML = "";

    top.forEach((habit, index) => {
        const row = document.createElement("div");
        row.className = "stats-leaderboard__row";

        const rank = document.createElement("span");
        rank.className = "stats-leaderboard__rank";
        rank.textContent = `#${index + 1}`;

        const name = document.createElement("span");
        name.className = "stats-leaderboard__name";
        name.textContent = habit.name;

        const track = document.createElement("span");
        track.className = "stats-leaderboard__bar-track";
        const fill = document.createElement("span");
        fill.className = "stats-leaderboard__bar-fill";
        track.appendChild(fill);

        const value = document.createElement("span");
        value.className = "stats-leaderboard__value";
        value.textContent = `${habit.streak ?? 0} j`;

        row.append(rank, name, track, value);
        leaderboard.appendChild(row);

        requestAnimationFrame(() => {
            fill.style.width = `${(Number(habit.streak ?? 0) / max) * 100}%`;
        });
    });
}

// ---- Heatmap de régularité ----

const heatmapEl = document.getElementById("statsHeatmap");

if (heatmapEl) {
    const weeks = 14;
    const cells = computeHeatmap(habits, weeks);

    heatmapEl.innerHTML = "";

    for (let w = 0; w < weeks; w++) {
        const col = document.createElement("div");
        col.className = "stats-heatmap__col";

        for (let d = 0; d < 7; d++) {
            const cell = cells[w * 7 + d];
            const div = document.createElement("div");
            div.className = "stats-heatmap__cell";
            div.dataset.level = cell.level;
            div.title = `${cell.date.toLocaleDateString("fr-FR")} — ${cell.count} complétion${cell.count > 1 ? "s" : ""}`;
            col.appendChild(div);
        }

        heatmapEl.appendChild(col);
    }
}

initRevealOnScroll();
