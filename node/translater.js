var tool = require("./tool")
class translator {
    constructor() {
        this.language = tool.getLanguage();
        this.data = require("../locale/" + this.language + ".json");
    }
    get(src) {
        return this.data[src] || src;
    }
}

module.exports = translator;