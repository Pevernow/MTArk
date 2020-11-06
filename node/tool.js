const fs = require('fs')
var path = require("path");
var request = require("request");
var remote = require('electron').remote

function getCPU() {
    var agent = navigator.userAgent.toLowerCase();
    if (agent.indexOf("win64") >= 0 || agent.indexOf("wow64") >= 0 || agent.indexOf("x64")) return "win64";
    return "win32";
}


/**
 * 允许被复制的文件后缀列表
 * @type {string[]}
 */
const copyExt = ['.html', '.php']
/**
 * 复制一个文件夹下的文件到另一个文件夹
 * @param src 源文件夹
 * @param dst 目标文件夹
 */
const copyDir = function (src, dst) {
    // 读取目录中的所有文件/目录
    fs.readdir(src, function (err, paths) {
        if (err) {
            throw err
        }
        paths.forEach(function (path) {
            const _src = src + '/' + path
            const _dst = dst + '/' + path
            let readable; let writable
            fs.stat(_src, function (err, st) {
                if (err) {
                    throw err
                }
                // 判断是否为文件
                if (st.isFile()) {
                    // 创建读取流
                    readable = fs.createReadStream(_src)
                    // 创建写入流
                    writable = fs.createWriteStream(_dst)
                    // 通过管道来传输流
                    readable.pipe(writable)
                }
                // 如果是目录则递归调用自身
                else if (st.isDirectory()) {
                    exists(_src, _dst, copyDir)
                }
            })
        })
    })
}
/**
 * 在复制目录前需要判断该目录是否存在，
 * 不存在需要先创建目录
 * @param src
 * @param dst
 * @param callback
 */
const exists = function (src, dst, callback) {
    // 如果路径存在，则返回 true，否则返回 false。
    if (fs.existsSync(dst)) {
        callback(src, dst)
    } else {
        fs.mkdir(dst, function () {
            callback(src, dst)
        })
    }
}
function cp_r(src, dst) {
    exists(src, dst, copyDir);
}

function StreamDownload(patchUrl, baseDir, callback) {
    return new Promise(function (resolve, reject) {
        let downloadCallback = callback; // 注册回调函数

        const downloadFile = path.basename(patchUrl); // 下载文件名称，也可以从外部传进来

        let receivedBytes = 0;
        let totalBytes = 0;

        const req = request({
            method: "GET",
            uri: patchUrl,
        });

        const out = fs.createWriteStream(path.join(baseDir, downloadFile));
        req.pipe(out);

        req.on("response", (data) => {
            // 更新总文件字节大小
            totalBytes = parseInt(data.headers["content-length"], 10);
        });

        req.on("data", (chunk) => {
            // 更新下载的文件块字节大小
            receivedBytes += chunk.length;
            downloadCallback((receivedBytes * 100) / totalBytes)
        });

        req.on("end", () => {
            resolve()
        });
    })
}

/*
class StreamDownload {
    constructor(patchUrl, baseDir, callback) {
        this.downloadCallback = callback; // 注册回调函数

        const downloadFile = path.basename(patchUrl); // 下载文件名称，也可以从外部传进来

        let receivedBytes = 0;
        let totalBytes = 0;

        const req = request({
            method: "GET",
            uri: patchUrl,
        });

        const out = fs.createWriteStream(path.join(baseDir, downloadFile));
        req.pipe(out);

        req.on("response", (data) => {
            // 更新总文件字节大小
            totalBytes = parseInt(data.headers["content-length"], 10);
        });

        req.on("data", (chunk) => {
            // 更新下载的文件块字节大小
            receivedBytes += chunk.length;
            this.showProgress(receivedBytes, totalBytes);
        });

        req.on("end", () => {
            console.log("下载已完成，等待处理");
            // TODO: 检查文件，部署文件，删除文件
            this.downloadCallback("finished", 0);
        });
    }
    showProgress(received, total) {
        const percentage = (received * 100) / total;
        // 用回调显示到界面上
        this.downloadCallback("progress", (received * 100) / total);
    }
}
*/
function getsync(url) {
    return new Promise(function (resolve, reject) {
        request.get(
            {
                url: url,
                headers: {
                    //设置请求头
                    "content-type": "application/json",
                    "user-agent": "MTArk",
                },
                timeout: 30000,
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    resolve(JSON.parse(body));
                } else
                    reject(error);
            }
        );
    });
}

function getLanguage() {
    return remote.getGlobal('sharedObject').language || "en";
}

module.exports = {
    cp_r,
    getsync,
    StreamDownload,
    getCPU,
    getLanguage
}