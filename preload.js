// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
let ipcRenderer = require('electron').ipcRenderer;
var core = require("./node/core");
worlds = require("./node/worlds");


//keep setImmediate alive
var _setImmediate = setImmediate;
process.once("loaded", function () {
    global.setImmediate = _setImmediate;
});

async function init() {
    //Upgrade Minetest
    CreateLodingRing(20, 1, "#FFFFFF");
    await core.upgrade();
}
window.addEventListener("load", function () {
    if (window.location.pathname.indexOf("init.html") != -1) {
        init();
    };
    if (window.location.pathname.indexOf("worlds.html") != -1) {
        worlds.show_worlds();
    };
});