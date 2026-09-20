// AI made
// Effets visuels partagés entre les pages du prototype : horloge d'en-tête,
// révélation au scroll, compteurs animés, confettis, toasts.

const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// reproduit utils/date.js (updateHeader / updateFooter), en lecture/écriture DOM uniquement
export function initHeaderClock() {
    const hourBox = document.querySelector(".header__hour-Box__text");
    const dayBox = document.querySelector(".header__day-Box__text");

    function tick() {
        const now = new Date();

        if (hourBox) {
            hourBox.textContent = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
        }

        if (dayBox) {
            const day = now.toLocaleDateString("fr-FR", { weekday: "long" });
            dayBox.textContent = day.charAt(0).toUpperCase() + day.slice(1);
        }
    }

    tick();
    setInterval(tick, 1000);
}

export function initFooterYear() {
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
}

export function initRevealOnScroll(selector = ".reveal") {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;

    if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
        elements.forEach(el => el.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        }
    }, { threshold: 0.15 });

    elements.forEach(el => observer.observe(el));
}

export function countUp(el, target, { duration = 900, prefix = "", suffix = "" } = {}) {
    if (!el) return;

    if (prefersReducedMotion()) {
        el.textContent = `${prefix}${target}${suffix}`;
        return;
    }

    const start = performance.now();

    function frame(now) {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);

        el.textContent = `${prefix}${value}${suffix}`;

        if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}

let confettiLayer = null;

export function burstConfetti(originEl, { colors } = {}) {
    if (!originEl || prefersReducedMotion()) return;

    if (!confettiLayer) {
        confettiLayer = document.createElement("div");
        confettiLayer.className = "confetti-layer";
        confettiLayer.setAttribute("aria-hidden", "true");
        document.body.appendChild(confettiLayer);
    }

    const rect = originEl.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    const palette = colors ?? ["#0F52BA", "#4338CA", "#34A853", "#F59E0B"];
    const pieceCount = 16;

    for (let i = 0; i < pieceCount; i++) {
        const piece = document.createElement("span");
        piece.className = "confetti-piece";

        const angle = (Math.PI * 2 * i) / pieceCount + Math.random() * 0.4;
        const distance = 60 + Math.random() * 50;

        piece.style.setProperty("--x", `${originX}px`);
        piece.style.setProperty("--y", `${originY}px`);
        piece.style.setProperty("--piece-color", palette[i % palette.length]);
        piece.style.setProperty("--piece-dx", `${Math.cos(angle) * distance}px`);
        piece.style.setProperty("--piece-dy", `${Math.sin(angle) * distance}px`);
        piece.style.setProperty("--piece-rot", `${Math.round(Math.random() * 360)}deg`);
        piece.style.setProperty("--piece-duration", `${600 + Math.random() * 300}ms`);
        piece.style.setProperty("--piece-delay", `${Math.random() * 60}ms`);

        piece.addEventListener("animationend", () => piece.remove(), { once: true });
        confettiLayer.appendChild(piece);
    }
}

let toastLayer = null;

export function showToast(message) {
    if (!toastLayer) {
        toastLayer = document.createElement("div");
        toastLayer.className = "toast-layer";
        document.body.appendChild(toastLayer);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;

    toast.addEventListener("animationend", () => toast.remove(), { once: true });
    toastLayer.appendChild(toast);
}
