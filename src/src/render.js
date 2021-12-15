function renderData(device) {
    $("device-name").innerHTML = device.name;
    $("device-ip").innerHTML = device.ip;
    $("device-avatar").innerHTML = device.avatar;
}

function SearchMessage() {
    return <p class="searching">Searching for devices...</p>
}

function $(id) {
    return document.getElementById(id);
}
