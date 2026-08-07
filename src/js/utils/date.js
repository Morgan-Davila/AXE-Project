const LOCAL_DEBUG = false;

debug(LOCAL_DEBUG, "Chargement date.js");


export function updateHeader() {
    const now = new Date();

    document.querySelector('.header__hour-Box__text').textContent =
        now.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });

    const day = now.toLocaleDateString('fr-FR', {
        weekday: 'long'
    });

    document.querySelector('.header__day-Box__text').textContent =
        day.charAt(0).toUpperCase() + day.slice(1);
}

export function updateFooter() {
    const yearSpan = document.getElementById("year");
    if (!yearSpan) return;

    yearSpan.textContent = new Date().getFullYear();
}