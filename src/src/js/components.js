function SearchMessage() {
    return '<p class="searching">Searching for sockets...</p>';
}

function SendingFileMessage() {
    return '<p>Sending File 📤</p>'
}

function SocketCard(socket) {
    return '\
    <div class="device-card main-color-default-theme general-shadow glass-theme device-card-dashboard" id="' + socket.name + socket.address + '-card">\
        <div class="card-content">\
            <div class="avatar avatar-card general-shadow glass-theme" id="' + socket.name + '-avatar">' +  generateAvatar(socket.name, 80)  + '</div>\
            <div class="device-info glass-theme">\
                <div class="info info-card">\
                    <h1>' + socket.name + '</h1>\
                    <small>' + socket.address + '</small>\
                </div>\
            </div>\
            <div class="device-info btn btn-send glass-theme" onclick="openSendFrame(' + "'"  + socket.name + "','" + socket.address + "','" + socket.PORT + "'" + ')">\
                <div id="' + socket.name + '-send" class="info info-card">\
                    <h1>Send file</h1>\
                </div>\
            </div>\
        </div>\
        <div class="select-file"></div>\
    </div>\
    '
}

function Frame(socketCardNoButton) {
    return '<div id="device-selected" class="device-selected">' + socketCardNoButton + '</div>';
}

function SocketCardNoButton(name, address) {
    return '\
    <div class="device-card glass-theme">\
        <div class="card-content">\
            <div class=" avatar avatar-card general-shadow glass-theme" id="device-selected-avatar">' + generateAvatar(name, 80) + '</div>\
            <div class="device-info glass-theme">\
                <div class="info info-card">\
                    <h1 id="device-selected-name">' + name +'</h1>\
                    <small id="device-selected-ip">' + address +'</small>\
                </div>\
            </div>\
        </div>\
        <div id="select-container" class="select-file"></div>\
    </div>\
    '
}

function SelectionBox(address, port) {
    return '\
    <div class="drag-and-drop glass-theme color-glass-theme" id="drag-and-drop"><p id="drop-text">Drag your file and drop it here</p></div>\
    <small id="path-to-file"></small>\
    <div class="btn btn-select glass-theme">\
        <form id="file-form" action="http://' +
            address +
            ":" + port +
            '/upload" method="post" target="frame2" enctype="multipart/form-data">\
            <iframe id="frame2" class="visually-hidden" name="frame2"></iframe>\
            <input class="visually-hidden" type="file" name="file" id="input-file" multiple>\
            <label class="btn" for="input-file">Select file 📁</label>\
        </form>\
    </div>\
    <div class="device-info btn btn-send glass-theme" onclick="sendFile(' + "'" + address + "','" + port + "'" + ')">\
        <div class="info info-card">\
            <h1>Send file</h1>\
        </div>\
    </div>'
}

function HiddenInput(name, value) {
    return '<input class="visually-hidden" name="' + name + '" value="' + value + '" type="text">'
}

function Div(id) {
    return '<div id="' + id + '" class="visually-hidden"></div>'
}

function FileReceivedMessage() {
    return '<p>File(s) recieved 📥</p>\
    <div>\
        <div class="device-info btn btn-send" onclick="openFilesFolder()">\
            <div class="info info-card glass-theme">\
                <h1>Show in folder</h1>\
            </div>\
        </div>\
    </div>\
    '
}

function FileSentMessage() {
    return '<p>File(s) sent ✅</p>'
}

function FileSentConfirmMessage(files, socket) {
    let contentLabel = ""
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
                files[i].name.slice(0, 25) +
                (files[i].name.length > 25 ? "..." : "");
        }
    }
    return '\
    <div>\
        <p>Do you want to sent this files?</p>\
        <small id="files-to-send">' + contentLabel + '</small>\
        <div class="device-info btn btn-send" onclick="sendFile(' + "'" + socket.address + "','" + socket.PORT + "'" + ')">\
            <form class="visually-hidden" id="file-form" action="http://' + socket.address + ":" + socket.PORT + '/upload" method="post" target="frame2" enctype="multipart/form-data">\
            <iframe id="frame2" class="visually-hidden" name="frame2"></iframe>\
            <input class="visually-hidden" type="file" name="file" id="input-file" multiple>\
            <label class="visually-hidden" class="btn" for="input-file">Select file 📁</label>\
            </form>\
            <div class="info info-card glass-theme">\
                <h1>Send</h1>\
            </div>\
        </div>\
    </div>'
}