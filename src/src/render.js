const { createAvatar } = require("@dicebear/avatars");
const style = require("@dicebear/adventurer");

function renderData(socket) {
    $("device-name").innerHTML = socket.name;
    $("device-ip").innerHTML = socket.localAdresses.join(" ");
    $("device-avatar").innerHTML = generateAvatar(socket.name);
}

function SearchMessage() {
    return '<p class="searching">Searching for sockets...</p>';
}

function $(id) {
    return document.getElementById(id);
}

function render(element, id, replace = false) {
    if (replace) {
        $(id).innerHTML = element;
    } else {
        $(id).innerHTML += element;
    }
}

function derender(id) {
    $(id).parentElement.removeChild($(id))
}

function generateAvatar(name, size) {
    return createAvatar(style, {
        seed: name || "seed",
        size: size || 40,
        backgroundColor: "#ABFD9E",
        radius: 50,
    });
}

function SocketCard(socket) {
    return '\
    <div class="device-card" id="' + socket.name + '-card">\
        <div class="card-content">\
            <div class=" avatar avatar-card" id="' + socket.name + '-avatar">' +  generateAvatar(socket.name, 80)  + '</div>\
            <div class="device-info">\
                <div class="info info-card">\
                    <h1>' + socket.name + '</h1>\
                    <small>' + socket.address + '</small>\
                </div>\
            </div>\
            <div class="device-info btn btn-send">\
                <div onclick="selectionFrame(' + "'"  + socket.name + "','" + socket.address + "'" + ')" id="' + socket.name + '-send" class="info info-card">\
                    <h1>Send file</h1>\
                </div>\
            </div>\
        </div>\
        <div class="select-file"></div>\
    </div>\
    '
}
