const { app, BrowserWindow } = require('electron')
const express = require('express')
const fs = require('fs');

const {dialog} = require('electron');

const api = express()
api.use(express.json())
const port = process.env.PORT || 8080
const path = require("path")

var frame 

var isBusy = false

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
        icon: __dirname + '/icons/icon.ico'
    })

    frame.loadFile(path.join(__dirname, "index.html"))
    // frame.openDevTools()
    frame.once('ready-to-show', () => {
        frame.show()
    })
}

app.on("ready", createViewport)

api.listen(port, function() {
    console.log("Module Express now listening...")
})

api.get("/minimize", function(request, response) {
    frame.minimize()
    response.send({ 
        success : true
    })
})

api.get('/isBusy', function(request, response) {
    response.send({isBusy : isBusy})
})

api.get("/close", function(request, response) {
    app.quit()
})

api.get("/maximize", function(request, response) {
    if(!frame.fullScreen) {
        frame.fullScreen = true
    } else {
        frame.fullScreen = false
    }
    response.send({
        success: true
    })
})

api.get("/selectFolder", async function(request, response) {
    let folderPath = await selectFolder()
    let data = {
        success : folderPath !== false ? true : false,
        path: folderPath
    }
    response.send(data)
})

async function selectFolder() {
    var directorio = await  dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    directorio = directorio.canceled ? undefined : path.resolve(directorio.filePaths[0]).replace(/\\/g, "/")
    return directorio !== undefined ? directorio : false
}

api.get('/downloadWindow', async function() {
    createDownloadWindow()
})

async function createDownloadWindow() {
    let downloadFrame = new BrowserWindow({
        width : 800,
        height : 600,
        fullscreenable : false,
        webPreferences : {
            nodeIntegration : true,
            contextIsolation : false
        },
        minWidth : 853,
        minHeight : 480,
        backgroundColor : "#36393F",
        show : false,
        downloadFrame : true,
        maximizable: false,
        resizable: false
    })

    downloadFrame.loadFile(path.join(__dirname, "download-shortcut.html"))
    downloadFrame.removeMenu()
    // downloadFrame.openDevTools()
    downloadFrame.once('ready-to-show', () => {
        downloadFrame.show()
    })
}