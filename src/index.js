const { app, BrowserWindow } = require("electron");
const fs2 = require("fs/promises");
const fs = require("fs");
var FormData = require("form-data");

const { dialog } = require("electron");
const path = require("path");
var ipcMain = require("electron").ipcMain;
const { default: axios } = require("axios");

var frame;

async function createViewport() {
    frame = new BrowserWindow({
        transparent: false, 
        width: 900,
        height: 620,
        minWidth: 900,
        minHeight: 620,
        fullscreenable: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        show: false,
        frame: false,
        maximizable: true,
        resizable: true,
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
    let buffers = []
    for (let i = 0; i < files.length; i++) {
        buffers[i] = fs.createReadStream(files[i].path, { highWaterMark: 20240 });
        formData.append("file", buffers[i], files[i].name);
    }

    // for (let i = 0; i < files.length; i++) {
    //     buffers[i] = await fs2.readFile(files[i].path);
    //     formData.append("file", buffers[i], files[i].name);
    // }

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
            maxContentLength: 10000000000,
            maxBodyLength: 100000000000,
            onUploadProgress: (progressEvent) => {
                let percentCompleted = Math.floor(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                console.log(percentCompleted);
            },
        });
        buffers.forEach(buffer => {
            buffer.close()
            buffer.destroy()
        })
        return "sent";
    } catch (e) {
        console.log(e);
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
