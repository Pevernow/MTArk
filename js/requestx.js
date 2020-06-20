function StreamDownload() {
  // 声明下载过程回调函数
  this.downloadCallback = null;
}

// 下载进度
StreamDownload.prototype.showProgress = function (received, total) {
  const percentage = (received * 100) / total;
  // 用回调显示到界面上
  this.downloadCallback("progress", percentage);
};

// 下载过程
StreamDownload.prototype.downloadFile = function (patchUrl, baseDir, callback) {
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
};
function getsync(url) {
  return new Promise(function (resolve, reject) {
    request.get(
      {
        url: url,
        headers: {
          //设置请求头
          "content-type": "application/json",
          "user-agent": "MtAdmin",
        },
      },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(JSON.parse(body)); // Show the HTML for the baidu homepage.
        } else {
          reject(error);
        }
      }
    );
  });
}
exports = {
    StreamDownload,
    getsync
}