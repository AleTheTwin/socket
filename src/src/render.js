const { createAvatar } = require("@dicebear/avatars");
const style = require("@dicebear/adventurer");
const { randomUUID } = require("crypto");

function renderData(socket) {
    $("device-name").innerHTML = socket.name;
    $("device-ip").innerHTML = socket.localAdresses.join(" ");
    $("device-avatar").innerHTML = generateAvatar(socket.name);
}

function render(element, id, replace = false) {
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
        backgroundColor: "#ABFD9E",
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

function closeModal() {
    let modal = $("modal");
    let modalShadow = $("modal-shadow");
    modal.classList.add("visually-hidden");
    modalShadow.classList.remove("modal-shadow");
    let modalContainer = $("modal-content");
    modalContainer.innerHTML = "";
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

function sendFile() {
    let uuid = randomUUID()
    let form = $("file-form")
    let files = $("input-file").files
    let inputUUID = randomUUID()
    $("input-file").id = inputUUID
    form.id = uuid
    render(document.getHTML(form, true), "frame")
    render(HiddenInput("uuid", uuid), uuid)
    render(SendingFileMessage(), "select-container", true)
    $(inputUUID).files = files
    $(uuid).submit();
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
    };

    $("drag-and-drop").ondragleave = () => {
        $("drop-text").innerHTML = "Drag your file and drop it here";
    };

    $("drag-and-drop").ondrop = (evt) => {
        evt.preventDefault();
        $("drop-text").innerHTML = "Drag your file and drop it here";
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

document.getHTML= function(who, deep){
    if(!who || !who.tagName) return '';
    var txt, ax, el= document.createElement("div");
    el.appendChild(who.cloneNode(false));
    txt= el.innerHTML;
    if(deep){
        ax= txt.indexOf('>')+1;
        txt= txt.substring(0, ax)+who.innerHTML+ txt.substring(ax);
    }
    el= null;
    return txt;
}
