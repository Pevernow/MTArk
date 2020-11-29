var fs = require("fs");
var tool = require("./tool")
var execSync = require("child_process").execSync;
var compressing = require("compressing");
var path = require("path");
var translater = require("./translater")
var S = new translater()

async function installminetest(url) {
    $("#description").text("更新minetest核心");
    $("body").append(
        '<progress id="progressbar" class="uk-progress uk-align-center" value="0" max="100" style="position: absolute;bottom: 0%;left: 0%;">' + S.get("Upgrading Core......") + '</progress>'
    );
    await new tool.StreamDownload(
        url,
        "./tmp",
        function (percentage) {
            // 显示进度
            $("#progressbar").attr("value", percentage);
        }
    );
    $("#description").text("安装minetest核心");
    await compressing.zip.uncompress("./tmp/" + path.basename(url), ".");
    if (fs.existsSync(".minetest")) {
        fs.rmdirSync(".minetest/bin");
        fs.rmdirSync(".minetest/builtin");
        fs.rmdirSync(".minetest/client");
        fs.rmdirSync(".minetest/locale");
        fs.renameSync("./tmp/" + path.basename(url, ".zip") + "/bin", ".minetest/bin");
        fs.renameSync("./tmp/" + path.basename(url, ".zip") + "/builtin", ".minetest/builtin");
        fs.renameSync("./tmp/" + path.basename(url, ".zip") + "/client", ".minetest/client");
        fs.renameSync("./tmp/" + path.basename(url, ".zip") + "/locale", ".minetest/locale");
    }
    //fs.renameSync(path.basename(url, ".zip"), ".minetest");
    fs.rmdirSync("./tmp/" + path.basename(url, ".zip"));
    console.log("minetest installed");
}

async function upgrade() {
    var cpu = tool.getCPU();
    try {
        var res = await tool.getsync(
            "https://api.github.com/repos/minetest/minetest/releases/latest", 1000
        );
    } catch (e) {
        console.log("Network timeout,sikpping upgrade");
        ipcRenderer.send("page-main");
        return;
    }
    if (fs.existsSync(".minetest")) {
        //检查minetest是否安装及版本;
        console.log("Core version:" + getMTversion());
        if (getMTversion() != res["name"]) {
            for (var i = 0, l = res["assets"].length; i < l; i++) {
                if (res["assets"][i]["name"].indexOf(cpu) != -1) {
                    console.log("Upgrading to " + res["assets"][i]["name"])
                    await installminetest(res["assets"][i]["browser_download_url"]);
                    return;
                }
            }
            console.log("No support new version for " + cpu)
        } else {
            console.log("The core is the latest version.");
        }
    } else {
        for (var i = 0, l = res["assets"].length; i < l; i++) {
            if (res["assets"][i]["name"].indexOf(cpu)) {
                installminetest(res["assets"][i]["browser_download_url"]);
                return;
            }
        }
        console.log("No support new version for " + cpu)
    }
}

function getMTversion() {
    return execSync(".minetest\\bin\\minetest.exe --version", { encoding: "utf-8" }).substring(0, 14)
}

module.exports = {
    upgrade,
    getMTversion
}