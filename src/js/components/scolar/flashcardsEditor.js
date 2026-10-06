import { safeId } from "../../utils/dom.js";

export let quill = null;

export function setupEditor() {
    const container = safeId("editor");
    if (!container) return;   // on n'est pas sur la bonne page

    // Tailles en px, alignement en style inline
    const Size = Quill.import("attributors/style/size");
    Size.whitelist = ["12px", "14px", "18px", "24px", "32px", "48px"];
    Quill.register(Size, true);
    Quill.register(Quill.import("attributors/style/align"), true);

    quill = new Quill(container, {
        theme: "snow",
        placeholder: "Écris ta flashcard...",
        modules: {
            //AI made : barre d'outils écrite dans scolar.html (#flashcardToolbar) pour pouvoir la placer à droite de la carte
            toolbar: "#flashcardToolbar"
        }
    });
}