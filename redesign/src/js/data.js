// AI made
// Couche de données du prototype de redesign — LECTURE SEULE.
// Si de vraies habitudes existent déjà dans le localStorage du navigateur
// (clé "habitArray", la même que services/storage.js), elles sont lues et
// affichées telles quelles. Ce fichier n'appelle jamais localStorage.setItem :
// aucune action de ce prototype ne peut modifier vos données réelles.
// Si rien n'est trouvé (ou hors du Live Server, en file:// par ex.), un jeu
// de données de démonstration est généré pour que le redesign reste lisible.

const STORAGE_KEY = "habitArray";

function dayTimestamp(daysAgo, hour) {
    const d = new Date();
    d.setHours(hour ?? (8 + Math.floor(Math.random() * 11)), Math.floor(Math.random() * 60), 0, 0);
    d.setDate(d.getDate() - daysAgo);
    return d.getTime();
}

function buildHistory(stepDays, count, offset = 0) {
    const executions = [];
    for (let i = count - 1; i >= 0; i--) {
        executions.push(dayTimestamp(offset + i * stepDays));
    }
    return executions;
}

function demoHabits() {
    return [
        {
            id: 1,
            name: "Boire 2L d'eau",
            type: "Santé",
            frequency: { type: "interval", value: 1 },
            duration: { unit: 60, value: 300 },
            streak: 14,
            createdAt: dayTimestamp(90),
            executions: buildHistory(1, 18, 0) // dernière exécution : aujourd'hui
        },
        {
            id: 2,
            name: "Méditation matinale",
            type: "Bien-être",
            frequency: { type: "interval", value: 1 },
            duration: { unit: 60, value: 600 },
            streak: 3,
            createdAt: dayTimestamp(40),
            executions: buildHistory(1, 3, 1) // dernière exécution : hier -> due aujourd'hui
        },
        {
            id: 3,
            name: "Lire 20 pages",
            type: "Lecture",
            frequency: { type: "interval", value: 2 },
            duration: { unit: 60, value: 1500 },
            streak: 6,
            createdAt: dayTimestamp(60),
            executions: buildHistory(2, 9, 2) // due aujourd'hui (tous les 2 jours)
        },
        {
            id: 4,
            name: "Courir 5 km",
            type: "Sport",
            frequency: { type: "weekly", value: [1, 3, 5] },
            duration: { unit: 60, value: 1800 },
            streak: 9,
            createdAt: dayTimestamp(70),
            executions: buildHistory(3, 11, 3)
        },
        {
            id: 5,
            name: "Ranger le bureau",
            type: "Maison",
            frequency: { type: "weekly", value: [2, 5] },
            duration: { unit: 60, value: 900 },
            streak: 2,
            createdAt: dayTimestamp(25),
            executions: buildHistory(4, 5, 4)
        },
        {
            id: 6,
            name: "Étirements du soir",
            type: "Santé",
            frequency: { type: "monthly", value: [1, 10, 20] },
            duration: { unit: 60, value: 720 },
            streak: 21,
            createdAt: dayTimestamp(110),
            executions: buildHistory(6, 14, 5)
        }
    ];
}

function loadRealHabits() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed) || parsed.length === 0) return null;

        return parsed;
    } catch (error) {
        return null;
    }
}

// point d'entrée : { habits, isDemo }
export function getHabits() {
    const real = loadRealHabits();

    if (real) {
        return { habits: real, isDemo: false };
    }

    return { habits: demoHabits(), isDemo: true };
}

export function isSameDay(timestamp1, timestamp2) {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);

    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

// reproduit fidèlement la logique de src/js/components/dashboard/dashboard.js (reactHabit)
export function classifyToday(habits) {
    const due = [];
    const done = [];
    const now = new Date();

    for (const habit of habits) {
        const type = habit.frequency?.type;
        const lastExecution = new Date(Number(habit.executions?.at(-1) ?? habit.createdAt));

        const doneToday = habit.executions?.some(execution => isSameDay(Number(execution), now)) ?? false;
        if (doneToday) {
            done.push(habit);
            continue;
        }

        let isDueToday = false;

        switch (type) {
            case "interval": {
                const interval = Number(habit.frequency.value);

                const msParDay = 1000 * 60 * 60 * 24;
                const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const lastExecMidnight = new Date(lastExecution.getFullYear(), lastExecution.getMonth(), lastExecution.getDate());

                const diffJours = Math.round((todayMidnight - lastExecMidnight) / msParDay);
                isDueToday = diffJours === interval;
                break;
            }

            case "weekly": {
                const dayOfWeek = now.getDay();
                isDueToday = habit.frequency.value.map(Number).includes(dayOfWeek);
                break;
            }

            case "monthly": {
                const dayOfMonth = now.getDate();
                isDueToday = habit.frequency.value.map(Number).includes(dayOfMonth);
                break;
            }
        }

        if (isDueToday) due.push(habit);
    }

    return { due, done };
}

export function joinFrench(list) {
    if (!Array.isArray(list) || list.length === 0) return "";
    if (list.length === 1) return String(list[0]);
    if (list.length === 2) return `${list[0]} et ${list[1]}`;

    return `${list.slice(0, -1).join(", ")} et ${list.at(-1)}`;
}

// reproduit fidèlement src/js/utils/format.js
export function translateFrequency(habit) {
    if (!habit?.frequency) return "";

    const { type, value } = habit.frequency;
    const days = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

    switch (type) {
        case "interval":
            return Number(value) === 1 ? "Tous les jours" : `Tous les ${value} jours`;

        case "weekly":
            if (!Array.isArray(value)) return "";
            return `Chaque ${joinFrench(value.map(day => days[day]).filter(Boolean))}`;

        case "monthly":
            if (!Array.isArray(value)) return "";
            return `Chaque ${joinFrench(value)} du mois`;

        default:
            return "";
    }
}

export function formatDuration(seconds) {
    seconds = Number(seconds);
    if (Number.isNaN(seconds)) return "Aucune durée spécifiée";

    if (seconds < 60) return `${seconds} s`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min`;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return remainingMinutes === 0 ? `${hours} h` : `${hours} h ${remainingMinutes} min`;
}

export function streakTier(streak) {
    if (streak >= 7) return "high";
    if (streak >= 3) return "low";
    return "cold";
}

// nombre d'exécutions (tous habitudes confondues) par jour, sur les `days` derniers jours
export function computeDailyCompletions(habits, days) {
    const now = new Date();
    const buckets = new Array(days).fill(0);

    for (const habit of habits) {
        for (const execution of habit.executions ?? []) {
            const execDate = new Date(Number(execution));
            const diffDays = Math.round((setMidnight(now) - setMidnight(execDate)) / 86400000);

            if (diffDays >= 0 && diffDays < days) {
                buckets[days - 1 - diffDays] += 1;
            }
        }
    }

    return buckets;
}

function setMidnight(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

// grille façon "contributions" GitHub : `weeks` colonnes de 7 jours, jusqu'à aujourd'hui
export function computeHeatmap(habits, weeks) {
    const totalDays = weeks * 7;
    const counts = computeDailyCompletions(habits, totalDays);

    const max = Math.max(1, ...counts);

    return counts.map((count, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (totalDays - 1 - index));

        let level = 0;
        if (count > 0) level = 1;
        if (count >= Math.ceil(max * 0.4)) level = 2;
        if (count >= Math.ceil(max * 0.7)) level = 3;
        if (count >= max) level = 4;

        return { date, count, level };
    });
}

export function computeStreakLeaderboard(habits, limit = 5) {
    return [...habits]
        .sort((a, b) => (b.streak ?? 0) - (a.streak ?? 0))
        .slice(0, limit);
}

export function computeStatTiles(habits) {
    const { due, done } = classifyToday(habits);
    const totalToday = due.length + done.length;

    const bestHabit = [...habits].sort((a, b) => (b.streak ?? 0) - (a.streak ?? 0))[0] ?? null;

    const last7 = computeDailyCompletions(habits, 7).reduce((sum, n) => sum + n, 0);

    return {
        total: habits.length,
        doneToday: done.length,
        totalToday,
        bestStreak: bestHabit?.streak ?? 0,
        bestStreakName: bestHabit?.name ?? "—",
        completions7d: last7
    };
}
