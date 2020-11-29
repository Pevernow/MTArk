// Modules to control application life and create native browser window
const os = require('os');
const { app, BrowserWindow, screen } = require('electron')
const path = require('path')
if (os.type() != 'Windows_NT') {
    //Only support windows this version
    app.exit();
}
function createWindow() {
    global.sharedObject = {
        language: app.getLocale()
    }
    // Create the browser window.
    let size = screen.getPrimaryDisplay().workAreaSize
    let width = parseInt(size.width * 0.5);
    let height = parseInt(size.height * 0.6);
    const mainWindow = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        },
        transparent: true,
        frame: false
    })
    let ipcMain = require('electron').ipcMain;
    //接收最小化命令
    ipcMain.on('window-min', function () {
        mainWindow.minimize();
    })
    //接收最大化命令
    ipcMain.on('window-max', function () {
        if (mainWindow.isMaximized()) {
            mainWindow.restore();
        } else {
            mainWindow.maximize();
        }
    })
    //接收关闭命令
    ipcMain.on('window-close', function () {
        mainWindow.close();
    })
    mainWindow.on('maximize', function () {
        mainWindow.webContents.send('main-window-max');
    })
    mainWindow.on('unmaximize', function () {
        mainWindow.webContents.send('main-window-unmax');
    })
    ipcMain.on("page-main", function () {
        mainWindow.loadURL(path.join(__dirname, '/main.html'))
    })
    ipcMain.on("page-worlds", function () {
        mainWindow.loadURL(path.join(__dirname, '/worlds.html'))
    })

    mainWindow.webContents.openDevTools();
    //mainWindow.setSkipTaskbar(true);
    // and load the index.html of the app.
    mainWindow.loadFile('init.html')
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.