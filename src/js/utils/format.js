const LOCAL_DEBUG = false;

debug(LOCAL_DEBUG, "Chargement format.js");




// ----------------------
// Durée
// ----------------------

export function formatDuration(seconds) {

    seconds = Number(seconds);

    if (Number.isNaN(seconds)) {
        debug(LOCAL_DEBUG, "formatDuration : valeur invalide", seconds);
        return "Aucune durée spécifiée";
    }
    
    if (seconds < 60) {
        return `${seconds} s`;
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
        return `${hours} h`;
    }

    return `${hours} h ${remainingMinutes} min`;
}





// ----------------------
// Date
// ----------------------

//AI made
export function formatDate(timestamp) {

    const date = new Date(Number(timestamp));

    if (Number.isNaN(date.getTime())) {
        debug(LOCAL_DEBUG, "formatDate : valeur invalide", timestamp);
        return "";
    }

    return date.toLocaleDateString("fr-FR");
}

//AI made
export function formatTime(timestamp) {

    const date = new Date(Number(timestamp));

    if (Number.isNaN(date.getTime())) {
        debug(LOCAL_DEBUG, "formatTime : valeur invalide", timestamp);
        return "";
    }

    return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
    });
}




// ----------------------
// Fréquence
// ----------------------

// Fonction pour joindre une liste avec la grammaire française
export function joinFrench(list) {

    if (!Array.isArray(list) || list.length === 0) {
        return "";
    }

    if (list.length === 1) {
        return list[0];
    }

    if (list.length === 2) {
        return `${list[0]} et ${list[1]}`;
    }

    return `${list.slice(0, -1).join(", ")} et ${list.at(-1)}`;
}





// Traduit les valeurs de fréquence en texte utilisateur
export function translateFrequency(data) {

    if (!data?.frequency) {
        debug(LOCAL_DEBUG, "translateFrequency : fréquence absente", data);
        return "";
    }

    const { type, value } = data.frequency;

    switch (type) {
        case "interval":
            return value === 1
                ? "Tous les jours"
                : `Tous les ${value} jours`;

        case "weekly": {
            const days = [
                "lundi",
                "mardi",
                "mercredi",
                "jeudi",
                "vendredi",
                "samedi",
                "dimanche"
            ];

            if (!Array.isArray(value)) {
                debug(LOCAL_DEBUG, "translateFrequency weekly : valeur invalide", value);
                return "";
            }

            return `Chaque ${joinFrench(
                value.map(day => days[day]).filter(Boolean)
            )}`;
        }

        case "monthly":
            if (!Array.isArray(value)) {
                debug(LOCAL_DEBUG, "translateFrequency monthly : valeur invalide", value);
                return "";
            }
            return `Chaque ${joinFrench(value)} du mois`;

        default:
            debug(LOCAL_DEBUG, "translateFrequency : type inconnu", type);
            return "";
    }

}