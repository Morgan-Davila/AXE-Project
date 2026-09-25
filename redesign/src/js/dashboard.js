// AI made
// Page Dashboard du prototype : rend les habitudes du jour, l'anneau de
// progression et le mini graphique Chart.js. Ne fait rien sur les pages où
// .habits est absent. Cocher une habitude ici ne modifie QUE une copie en
// mémoire (aucun localStorage.setItem) : c'est une démonstration
// d'interaction, pas une vraie persistance.

import { countUp, burstConfetti, showToast } from "./effects.js";
import { classifyToday, streakTier, computeDailyCompletions } from "./data.js";

export function initDashboardPage(initialHabits) {
    const habitsPlace = document.querySelector(".habits");
    if (!habitsPlace) return;

    let habits = initialHabits.map(h => ({ ...h, executions: [...(h.executions ?? [])] }));

    const progressRing = document.getElementById("todayProgress");

    function buildCard(habit, isDone, index) {
        const article = document.createElement("article");
        article.className = "habits__cell" + (isDone ? " habits__cell--done" : "");
        article.style.setProperty("--cell-index", index);
        article.dataset.habitId = habit.id;

        const title = document.createElement("p");
        title.className = "habits__cell__title";
        title.textContent = habit.name;

        const right = document.createElement("div");
        right.className = "habits__cell--right";

        const streak = document.createElement("span");
        streak.className = "habits__cell__streak";
        streak.dataset.tier = streakTier(Number(habit.streak ?? 0));
        streak.textContent = `${habit.streak ?? 0}🔥`;

        const checkmarkWrapper = document.createElement("div");
        checkmarkWrapper.className = "habits__cell__checkmark";

        const label = document.createElement("label");
        label.className = "container";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = isDone;
        checkbox.disabled = isDone;

        const checkmark = document.createElement("div");
        checkmark.className = "checkmark";

        // AI made — ajouté À CÔTÉ du .checkmark (jamais dedans/dessus) pour l'effet visuel
        const pulse = document.createElement("span");
        pulse.className = "checkmark-pulse";

        label.append(checkbox, checkmark, pulse);
        checkmarkWrapper.appendChild(label);
        right.append(streak, checkmarkWrapper);
        article.append(title, right);

        checkbox.addEventListener("change", () => {
            if (!checkbox.checked) return;

            burstConfetti(checkmark);
            pulse.classList.add("is-active");

            const habit = habits.find(h => h.id === article.dataset.habitId || String(h.id) === article.dataset.habitId);
            habit?.executions.push(Date.now());

            showToast("Aperçu uniquement — vos données ne sont pas modifiées.");

            window.setTimeout(render, 260);
        });

        return article;
    }

    function render() {
        const { due, done } = classifyToday(habits);

        habitsPlace.innerHTML = "";
        let index = 0;

        for (const habit of done) habitsPlace.appendChild(buildCard(habit, true, index++));
        for (const habit of due) habitsPlace.appendChild(buildCard(habit, false, index++));

        const total = due.length + done.length;
        const ratio = total === 0 ? 0 : done.length / total;

        if (progressRing) {
            const circle = progressRing.querySelector("circle:last-child");
            const label = progressRing.querySelector("[data-progress-label]");

            if (circle) circle.style.strokeDashoffset = String(88 * (1 - ratio));
            if (label) label.textContent = `${done.length}/${total}`;
        }
    }

    render();

    const scheduleDate = document.querySelector(".schedule__date");
    if (scheduleDate) {
        const today = new Date();
        const label = today.toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "2-digit" });
        scheduleDate.textContent = label.charAt(0).toUpperCase() + label.slice(1);
    }

    // ---- Mini graphique hebdomadaire (Chart.js) ----

    const weeklyCanvas = document.getElementById("dashboardWeeklyChart");
    const statDoneToday = document.getElementById("statDoneToday");
    const statWeekTotal = document.getElementById("statWeekTotal");

    const dailyCounts = computeDailyCompletions(habits, 7);
    const weekTotal = dailyCounts.reduce((sum, n) => sum + n, 0);
    const { due: dueNow, done: doneNow } = classifyToday(habits);

    if (statDoneToday) countUp(statDoneToday, doneNow.length, { suffix: `/${dueNow.length + doneNow.length}` });
    if (statWeekTotal) countUp(statWeekTotal, weekTotal);

    if (weeklyCanvas && window.Chart) {
        const labels = new Array(7).fill(0).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", "");
        });

        const rootStyles = getComputedStyle(document.documentElement);

        new window.Chart(weeklyCanvas, {
            type: "bar",
            data: {
                labels,
                datasets: [{
                    data: dailyCounts,
                    backgroundColor: rootStyles.getPropertyValue("--accent").trim() || "#0F52BA",
                    borderRadius: 8,
                    maxBarThickness: 28
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: true } },
                scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: rootStyles.getPropertyValue("--border").trim() } }
                }
            }
        });
    }
}
