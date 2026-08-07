const LOCAL_DEBUG = false;

debug(LOCAL_DEBUG, "Chargement dom.js");



/*
Recherche un élément avec querySelector().
Retourne null si l'élément n'existe pas.
*/
export function safeQuery(selector, parent = document) {

    const element = parent.querySelector(selector);

    if (!element) {
        debug(LOCAL_DEBUG, `Element introuvable : ${selector}`);
    }

    return element;

}



/*
Recherche plusieurs éléments avec querySelectorAll().
Retourne toujours un NodeList (éventuellement vide).
*/
export function safeQueryAll(selector, parent = document) {

    const elements = parent.querySelectorAll(selector);

    if (elements.length === 0) {
        debug(LOCAL_DEBUG, `Aucun élément trouvé : ${selector}`);
    }

    return elements;

}



/*
Recherche un élément par son id.
Retourne null si l'élément n'existe pas.
*/
export function safeId(id) {

    const element = document.getElementById(id);

    if (!element) {
        debug(LOCAL_DEBUG, `Element introuvable : #${id}`);
    }

    return element;

}



/*
Vérifie qu'un élément existe.
*/
export function exists(element) {
    return element !== null;
}