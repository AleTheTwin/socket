const { app, BrowserWindow } = require('electron')
const express = require('express')
const fs = require('fs');

const {dialog} = require('electron');
const path = require("path")
var ipcMain = require('electron').ipcMain

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
    frame.openDevTools()
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