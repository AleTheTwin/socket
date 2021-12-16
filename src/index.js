const Socket = require("./socket");
const { shell } = require("electron");
const ipcRenderer = require("electron").ipcRenderer;
const fs = require("fs");
const { getDownloadsFolder } = require("platform-folders");
const socketServer = new Socket({ port: 1234 }, Socket.SERVER);

var config 

main();
async function main() {
    await validateConfig();
    socketServer.PORT = config.port;
    socketServer.initServer();
    socketServer.lookForSockets();

    window.onload = renderData(socketServer);

    socketServer.on("connection", (socket) => {
        let card = SocketCard(socket);
        render(card, "device-container");
    });

    socketServer.on("disconnection", (disconnectedSocket) => {
        derender(
            disconnectedSocket.name + disconnectedSocket.address + "-card"
        );
    });

    socketServer.on("files-received", (files) => {
        files.forEach(async file => {
            await saveFile(file)
        })
    })
}

function openFilesFolder() {
    shell.openPath(config.files);
}

function configHas(obj, parameter) {
    let keys = Object.keys(obj);
    return keys.includes(parameter);
}

function validateConfig() {
    return new Promise(async (resolve, reject) => {
        let defaultFilesFolder = (getDownloadsFolder() + "/Socket Files/").replace(/\\/g, "/");
        let defaultPort = 1407
        if (!fs.existsSync("./src/config.json")) {
            config = { files: defaultFilesFolder, port: defaultPort };
            updateConfig(config)
        } else {
            config = require("./config.json");
            if(!configHas(config, "files")) {
                config.files = defaultFilesFolder
            }
            if(!configHas(config, "port")) {
                config.port = defaultPort
            }
            updateConfig(config)
        }

        if(!fs.existsSync(config.files)) {
            fs.mkdirSync(config.files)
        }
        resolve()
    });
}

function updateConfig(config) {
    fs.writeFileSync("./src/config.json", JSON.stringify(config));
}

function saveFile(file, count = 0) {
    return new Promise((resolve, reject) => {
        let filepath = config.files + "/" + file.name
        while(fs.existsSync(filepath)) {
            file.name = renameFile(file, count)
            filepath = config.files + "/" + file.name
        } 
        file.mv(filepath, err => {
            if(err) {
                console.log(err)
            }
        })
               
    })
}

function renameFile(file, count) {
    let aux = file.name;
    aux = aux.split("").reverse().join("");
    aux = aux.slice(aux.indexOf(".") + 1);
    let name = aux.split("").reverse().join("");
    let extension = file.name.slice(file.name.indexOf("."));

    let plus = " (" + (count + 1) + ")";
    name = name + plus;
    return name + extension;
}