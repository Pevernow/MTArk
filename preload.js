// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
export * from './js/fsx'
export * from './js/requestx'
var compressing = require("compressing");
var fs = require("fs");
var path = require("path");
var request = require("request");
var execSync = require("child_process").execSync;

var _setImmediate = setImmediate;
process.once("loaded", function () {
  global.setImmediate = _setImmediate;
});

function installminetest(url) {
  $("#title").text("下载minetest核心");
  $("body").append(
    '<progress id="progressbar" class="uk-progress uk-align-center" value="0" max="100"></progress>'
  );
  StreamDownload.downloadFile(
    url,
    "./tmp",
    async function (arg, percentage) {
      if (arg === "progress") {
        // 显示进度
        $("#progressbar").attr("value", percentage);
      } else if (arg === "finished") {
        // 解压
        $("#title").text("安装minetest核心");
        await compressing.zip.uncompress("./tmp/"+path.basename(url), ".");
        fs.renameSync(path.basename(url,".zip"),".minetest");
        console.log("minetest installed");
        init();
      }
    }
  );
}

var StreamDownload = new StreamDownload();
async function init() {
  var res = await getsync(
    "https://api.github.com/repos/minetest/minetest/releases/latest"
  );
  //检查minetest安装情况
  if (fs.existsSync(".minetest")) {
    //检查minetest是否安装及版本;
    if (
      execSync(".minetest\\bin\\minetest.exe --version", {
        encoding: "utf-8",
      }).substring(0, 14) != res["name"]
    ) {
      console.log("version too low!");
      installminetest(res["assets"][1]["browser_download_url"]);
    } else {
      console.log("update done!");
    }
  } else {
    installminetest(res["assets"][1]["browser_download_url"]);
  }
}
window.addEventListener("load", function () {
  init();
});
