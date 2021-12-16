const { app, BrowserWindow } = require("electron");
const fs = require("fs/promises");
var FormData = require("form-data");

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

ipcMain.handle("send-file", async (eve, files, address, port, uuid) => {
    let url = "http://" + address + ":" + port + "/upload";
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        let buff = await fs.readFile(files[i]);
        formData.append("file", buff);
    }
    formData.append("uuid", uuid);

    let config = {
        headers: {
            "content-type": "multipart/form-data",
        },
    };
    try {
        let response = await axios.post(url, formData, {
            headers: {
                ...formData.getHeaders(),
                Authentication: "Bearer ...",
            },
        });
        return response.data;
    } catch (e) {
        return e;
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
