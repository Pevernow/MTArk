// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
var core = require("./node/core")

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
    init();
});