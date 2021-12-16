const { app, BrowserWindow } = require("electron");
const fs = require("fs");
var FormData = require('form-data');

const { dialog } = require("electron");
const path = require("path");
var ipcMain = require("electron").ipcMain;
const { default: axios } = require("axios");

var frame;

async function createViewport() {
    frame = new BrowserWindow({
        width: 900,
        height: 620,
        fullscreenable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        backgroundColor: "#36393F",
        show: false,
        frame: false,
        maximizable: false,
        resizable: false,
        icon: path.join(__dirname, "icons/icon.ico"),
    });
    frame.loadFile(path.join(__dirname, "index.html"));
    // frame.openDevTools()
    frame.once("ready-to-show", () => {
        frame.show();
    });
}

app.on("ready", createViewport);

ipcMain.handle("minimize-window", () => {
    frame.minimize();
});

ipcMain.handle("send-file", async (files) => {
    let url = "http://192.168.0.21:1407/upload";
    let formData = new FormData();
    console.log(files);
    for(let i = 0; i < files.length; i++) {
        console("Reading from ", file);
        let buff = await fs.readFile(file)
        formData.append('file', buff, "prueba.img")
    }
    // formData.append("file", files);
    let config = {
        headers: {
            "content-type": "multipart/form-data",
        },
    };
    try {
        let response = await axios.post(url, formData, config)
        return response.data
    } catch (e) {
        return e
    }
});

ipcMain.handle("close-window", () => {
    app.quit();
});

async function selectFolder() {
    var directorio = await dialog.showOpenDialog({
        properties: ["openDirectory"],
    });
    directorio = directorio.canceled
        ? undefined
        : path.resolve(directorio.filePaths[0]).replace(/\\/g, "/");
    return directorio !== undefined ? directorio : false;
}
