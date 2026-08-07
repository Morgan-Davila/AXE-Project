//Gestion du debug, dans un tableau AXE il y a les réglages globaux, dont le paramètre de debug
window.AXE = {
    NAME: "AXE",
    VERSION: "AXE 1",
    DEBUG: false
};


window.debug = function (localDebug, ...args) {
    if (window.AXE.DEBUG || localDebug) {
        console.log(`[${window.AXE.VERSION}]`, ...args);
    }
};