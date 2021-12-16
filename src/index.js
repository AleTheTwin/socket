const { app, BrowserWindow } = require('electron')
const fs = require('fs');

const {dialog} = require('electron');
const path = require("path")
var ipcMain = require('electron').ipcMain

var frame

async function createViewport() {
    frame = new BrowserWindow({
        width : 900,
        height : 620,
        fullscreenable : false,
        webPreferences : {
            nodeIntegration : true,
            contextIsolation : false,
        },
        backgroundColor : "#36393F",
        show : false,
        frame : false,
        maximizable: false,
        resizable: false,
        icon: path.join(__dirname, 'icons/icon.ico')
    })
    frame.loadFile(path.join(__dirname, "index.html"))
    // frame.openDevTools()
    frame.once('ready-to-show', () => {
        frame.show()
    })
}

app.on("ready", createViewport)

ipcMain.handle("minimize-window", () => {
    frame.minimize()
})

ipcMain.handle("close-window", () => {
    app.quit()
})

async function selectFolder() {
    var directorio = await  dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    directorio = directorio.canceled ? undefined : path.resolve(directorio.filePaths[0]).replace(/\\/g, "/")
    return directorio !== undefined ? directorio : false
}