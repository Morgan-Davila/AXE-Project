import { safeId, safeQuery } from "../../utils/dom.js";
import { editableFlashcard, flashcardSwitchButton } from "./scolarUI.js";

//AI made : un éditeur Quill par face de la carte
export const editors = { front: null, back: null };

//AI made : une barre d'outils et une face par côté, pour pouvoir masquer celle qui n'est pas visible
const toolbars = { front: null, back: null };
const faces = { front: null, back: null };

export function setupEditor() {
    const frontContainer = safeId("editorFront");
    const backContainer = safeId("editorBack");
    const toolbarFront = safeId("flashcardToolbarFront");
    if (!frontContainer || !backContainer || !toolbarFront) return;   // on n'est pas sur la bonne page

    // Tailles en px, alignement en style inline
    const Size = Quill.import("attributors/style/size");
    Size.whitelist = ["12px", "14px", "18px", "24px", "32px", "48px"];
    Quill.register(Size, true);
    Quill.register(Quill.import("attributors/style/align"), true);

    //AI made : chaque éditeur a besoin de sa propre barre (une barre partagée appliquerait les clics aux deux).
    // On duplique celle du HTML avant que Quill ne la transforme.
    const toolbarBack = toolbarFront.cloneNode(true);
    toolbarBack.id = "flashcardToolbarBack";
    toolbarFront.after(toolbarBack);

    toolbars.front = toolbarFront;
    toolbars.back = toolbarBack;
    faces.front = safeQuery(".editableFlashcard__face--front");
    faces.back = safeQuery(".editableFlashcard__face--back");

    //AI made
    editors.front = new Quill(frontContainer, {
        theme: "snow",
        placeholder: "Recto : écris ta question...",
        modules: { toolbar: "#flashcardToolbarFront" }
    });

    editors.back = new Quill(backContainer, {
        theme: "snow",
        placeholder: "Verso : écris ta réponse...",
        modules: { toolbar: "#flashcardToolbarBack" }
    });

    showEditorFace("front", false);
}

//AI made : affiche la barre de la face visible et rend l'autre face inactive (ni clic, ni Tab)
export function showEditorFace(face, focus = true) {
    if (!editors.front || !editors.back) return;
    const hidden = face === "front" ? "back" : "front";

    toolbars[face].classList.remove("flashcardToolbar--hidden");
    toolbars[hidden].classList.add("flashcardToolbar--hidden");

    if (faces[face]) faces[face].inert = false;
    if (faces[hidden]) faces[hidden].inert = true;

    if (focus) editors[face].focus();
}


//AI made : vide les deux faces et remet la carte sur le recto
export function resetFlashcardEditor() {
    if (!editors.front || !editors.back) return;   // pas sur la page scolar

    editors.front.setContents([]);
    editors.back.setContents([]);

    if (editableFlashcard) editableFlashcard.classList.remove("editableFlashcard--flipped");
    if (flashcardSwitchButton) flashcardSwitchButton.setAttribute("aria-pressed", "false");
    showEditorFace("front", false);
}
