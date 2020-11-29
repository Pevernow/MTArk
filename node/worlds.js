var fs = require("fs");
var exec = require("child_process").exec;
var delDir = require("./tool").delDir

function open_world(name) {
    // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
    workerProcess = exec(".minetest\\bin\\minetest.exe --console --go --worldname " + name, {})
    // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})

    // 打印正常的后台可执行程序输出
    workerProcess.stdout.on('data', function (data) {
        console.log('stdout: ' + data)
    })

    // 打印错误的后台可执行程序输出
    workerProcess.stderr.on('data', function (data) {
        console.log('stderr: ' + data)
    })

    // 退出之后的输出
    workerProcess.on('close', function (code) {
        console.log('out code：' + code)
    })
}

function del_world(name) {
    delDir(".minetest\\worlds\\" + name)
    $("#worldlist").empty()
    worlds.show_worlds()
}

function show_worlds() {
    const files = fs.readdirSync('./.minetest/worlds')
    files.forEach(function (worldname, index) {
        let stat = fs.lstatSync("./.minetest/worlds/" + worldname)
        if (stat.isDirectory() === true) {
            var worldnameout = "<td>" + worldname + "</td>"
            var ctimeout = "<td>" + stat.ctime.toLocaleString() + "</td>"
            var openworldout = "<button class='uk-margin-right uk-button uk-button-primary uk-button-small' onclick='worlds.open_world(\"" + worldname + "\")'>进入世界</button>"
            var delworldout = "<button class='uk-margin-right uk-button uk-button-danger uk-button-small' uk-toggle='target: #delworld_modal'>删除世界</button>"
            var buttonout = "<td>" + openworldout + delworldout + "</td>"
            $("#worldlist").append("<tr>" + worldnameout + ctimeout + buttonout + "</tr>")
            $("#delworld").on("click", function () {
                worlds.del_world(worldname)
            })
        }
    })
}

module.exports = {
    open_world,
    show_worlds,
    del_world
}