const Socket = require("./socket");
const { shell } = require("electron");
const ipcRenderer = require("electron").ipcRenderer;
const fs = require("fs");
const fs2 = require("fs/promises");
const { getDownloadsFolder } = require("platform-folders");
const socketServer = new Socket({ port: 1234 }, Socket.SERVER);
const path = require("path")
const { default: axios } = require("axios");
var FormData = require("form-data");

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

    socketServer.on("files-received", (files, socket, uuid) => {
        files.forEach(async file => {
            await saveFile(file)
        })
        socketServer.sendReceivedConfirmation(socket, uuid)
        showReceivedConfirmation(socket)
    })

    socketServer.on("files-sent", (socket, uuid) => {
        showSentConfirmation(socket)
        // $(uuid).parentElement.removeChild($(uuid));
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
        if (!fs.existsSync(path.join(__dirname, "config.json"))) {
            config = { files: defaultFilesFolder, port: defaultPort };
            updateConfig(config)
        } else {
            config = require(path.join(__dirname, "config.json"));
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
    fs.writeFileSync(path.join(__dirname, "config.json"), JSON.stringify(config));
}

function saveFile(file, count = 0) {
    return new Promise((resolve, reject) => {
        let filepath = config.files + "/" + file.name
        let aux
        while(fs.existsSync(filepath)) {
            aux = file.name
            aux = renameFile(file, count)
            filepath = config.files + "/" + aux
            count++;
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

function sendFile(address, port) {
    let uuid = randomUUID()
    let form = $("file-form")
    let files = $("input-file").files
    let paths = []
    for(let i = 0; i < files.length; i++) {
        paths.push({name: files[i].name, path: files[i].path})
    }
    let inputUUID = randomUUID()
    $("input-file").id = inputUUID
    form.id = uuid
    render(HiddenInput("uuid", uuid), form.id)
    render(document.getHTML(form, true), "frame")
    render(SendingFileMessage(), "select-container", true)
    $(inputUUID).files = files
    // ipcRenderer.invoke("send-file", paths, address, port, uuid).then((result) => {
    //     console.log(result)
    // })
    send("send-file", paths, address, port, uuid)
}

async function send(eve, files, address, port, uuid){
    let url = "http://" + address + ":" + port + "/upload";
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        let buff = fs.createReadStream(files[i].path, { highWaterMark: 1024 * 1024 * 200 });
        formData.append("file", buff, files[i].name);
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
            maxContentLength: 10000000000,
            maxBodyLength: 100000000000,
            onUploadProgress: (progressEvent) => {
                let percentCompleted = Math.floor(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                console.log(percentCompleted);
            },
        });
        return "sending";
    } catch (e) {
        console.log(e);
        return "";
    }
}