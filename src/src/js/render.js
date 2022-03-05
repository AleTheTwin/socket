const { createAvatar } = require("@dicebear/avatars");
const style = require("@dicebear/adventurer");
const { randomUUID } = require("crypto");

function renderData(socket) {
    $("device-name").innerHTML = socket.name;
    $("device-ip").innerHTML = socket.localAdresses.join(" ");
    $("device-avatar").innerHTML = generateAvatar(socket.name);
}

async function setDragOverListeners(socket) {
    let id = socket.name + socket.address + "-card";
    await sleep(500);
    $(id).ondragover = (event) => {
        event.preventDefault();
        $(id).classList.add("dragover-device-card");
    };

    $(id).ondragleave = (event) => {
        event.preventDefault();
        $(id).classList.remove("dragover-device-card");
    };

    $(id).ondrop = async (event) => {
        event.preventDefault();
        $(id).classList.remove("dragover-device-card");

        let files = event.dataTransfer.files;
        console.log(files);

        let socketCard = SocketCardNoButton(socket.name, socket.address);
        let frame = Frame(socketCard);
        render(frame, "modal-content");
        openModal();
        await sleep(750);
        $("select-container").classList.add("select-file-space");
        await sleep(750);
        let message = FileSentConfirmMessage(files, socket)
        render(message, "select-container");
        $('input-file').files = files
    };
}

function render(element, id, replace = false, socket) {
    if (socket) {
        if ($(socket.name + socket.address + "-card")) {
            return;
        }
    }

    if (element.id !== undefined) {
        return;
    }
    if (replace) {
        $(id).innerHTML = element;
    } else {
        $(id).innerHTML += element;
    }
}

function derender(id) {
    $(id).parentElement.removeChild($(id));
}

function generateAvatar(name, size) {
    return createAvatar(style, {
        seed: name || "seed",
        size: size || 40,
        backgroundColor: "#00000000",
        radius: 50,
    });
}

async function openSendFrame(name, address, port) {
    let socketCard = SocketCardNoButton(name, address);
    let frame = Frame(socketCard);
    render(frame, "modal-content");
    openModal();
    await sleep(750);
    $("select-container").classList.add("select-file-space");
    await sleep(750);
    let selectFileBox = SelectionBox(address, port);
    render(selectFileBox, "select-container");
    inputListen();
}

async function showSentConfirmation(socket) {
    if (modalIsOpen()) {
        closeModal();
    }
    let frame = Frame(SocketCardNoButton(socket.name, socket.address));
    render(frame, "modal-content");
    openModal();
    await sleep(750);
    $("select-container").classList.add("select-file-space");
    await sleep(750);
    render(FileSentMessage(), "select-container", true);
}

async function showReceivedConfirmation(socket) {
    if (modalIsOpen()) {
        closeModal();
    }
    let frame = Frame(SocketCardNoButton(socket.name, socket.address));
    render(frame, "modal-content");
    openModal();
    await sleep(750);
    $("select-container").classList.add("select-file-space");
    await sleep(750);
    render(FileReceivedMessage(), "select-container", true);
}

function closeModal() {
    let modal = $("modal");
    let modalShadow = $("modal-shadow");
    modal.classList.add("visually-hidden");
    modalShadow.classList.remove("modal-shadow");
    let modalContainer = $("modal-content");
    modalContainer.innerHTML = "";
}

function modalIsOpen() {
    let modal = $("modal");
    return !modal.classList.contains("visually-hidden");
}

function openModal() {
    let modal = $("modal");
    let modalShadow = $("modal-shadow");
    modal.classList.remove("visually-hidden");
    modalShadow.classList.add("modal-shadow");
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function $(id) {
    return document.getElementById(id);
}

function inputListen() {
    $("input-file").onchange = (event) => {
        let files = $("input-file").files;
        let contentLabel = "";
        for (let i = 0; i < files.length; i++) {
            if (i > 0) {
                contentLabel += "<br>";
            }
            if (i > 3) {
                contentLabel += "more...";
                break;
            } else {
                contentLabel +=
                    "📄 " +
                    files[i].name.slice(0, 35) +
                    (files[i].name.length > 35 ? "..." : "");
            }
        }

        render(contentLabel, "path-to-file", true);
    };

    $("drag-and-drop").ondragover = $("drag-and-drop").ondragenter = (evt) => {
        evt.preventDefault();
        $("drop-text").innerHTML = "Drop it!";
        $("drag-and-drop").style.background = "linear-gradient(217deg, #df69db30, #7d6ce530 70.71%)";
    };

    $("drag-and-drop").ondragleave = () => {
        $("drop-text").innerHTML = "Drag your file and drop it here";
        $("drag-and-drop").style.background = "#b5b5b500";
    };

    $("drag-and-drop").ondrop = (evt) => {
        evt.preventDefault();
        $("drop-text").innerHTML = "Drag your file and drop it here";
        $("drag-and-drop").style.background = "#b5b5b500";
        $("input-file").files = evt.dataTransfer.files;
        let files = $("input-file").files;
        let contentLabel = "";
        for (let i = 0; i < files.length; i++) {
            if (i > 0) {
                contentLabel += "<br>";
            }
            if (i > 3) {
                contentLabel += "more...";
                break;
            } else {
                contentLabel +=
                    "📄 " +
                    files[i].name.slice(0, 35) +
                    (files[i].name.length > 35 ? "..." : "");
            }
        }
        render(contentLabel, "path-to-file", true);
    };
}

document.getHTML = function (who, deep) {
    if (!who || !who.tagName) return "";
    var txt,
        ax,
        el = document.createElement("div");
    el.appendChild(who.cloneNode(false));
    txt = el.innerHTML;
    if (deep) {
        ax = txt.indexOf(">") + 1;
        txt = txt.substring(0, ax) + who.innerHTML + txt.substring(ax);
    }
    el = null;
    return txt;
};

$("button-files").onmouseover = () => {
    $("files-icon").innerHTML = " 📂";
};

$("button-files").onmouseout = () => {
    $("files-icon").innerHTML = " 📁";
};
