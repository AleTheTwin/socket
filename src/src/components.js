function SearchMessage() {
    return '<p class="searching">Searching for sockets...</p>';
}

function SendingFileMessage() {
    return '<p>Sending File 📤</p>'
}

function SocketCard(socket) {
    return '\
    <div class="device-card" id="' + socket.name + socket.address + '-card">\
        <div class="card-content">\
            <div class=" avatar avatar-card" id="' + socket.name + '-avatar">' +  generateAvatar(socket.name, 80)  + '</div>\
            <div class="device-info">\
                <div class="info info-card">\
                    <h1>' + socket.name + '</h1>\
                    <small>' + socket.address + '</small>\
                </div>\
            </div>\
            <div onclick="openSendFrame(' + "'"  + socket.name + "','" + socket.address + "','" + socket.PORT + "'" + ')" class="device-info btn btn-send">\
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
    <div class="device-card">\
        <div class="card-content">\
            <div class=" avatar avatar-card" id="device-selected-avatar">' + generateAvatar(name, 80) + '</div>\
            <div class="device-info">\
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
    <div class="drag-and-drop" id="drag-and-drop"><p id="drop-text">Drag your file and drop it here</p></div>\
    <small id="path-to-file"></small>\
    <div class="btn btn-select">\
    <form id="file-form" action="http://' +
        address +
        ":" + port +
        '/upload" method="post" target="frame2" enctype="multipart/form-data">\
        <iframe id="frame2" class="visually-hidden" name="frame2"></iframe>\
        <input class="visually-hidden" type="file" name="file" id="input-file" multiple>\
        <label class="btn" for="input-file">Select file 📁</label>\
    </form>\
    </div>\
    <div class="device-info btn btn-send" onclick="sendFile()">\
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

function FileRecievedMessage() {
    return '<p>File(s) recieved 📥</p>\
    <div>\
        <div class="device-info btn btn-send" onclick="openFilesFolder()">\
            <div class="info info-card">\
                <h1>Show in folder</h1>\
            </div>\
        </div>\
    </div>\
    '
}

function FileRecievedMessage() {
    return '<p>File(s) sent ✅</p>'
}