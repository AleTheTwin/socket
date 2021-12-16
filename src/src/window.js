
function minimize() {
    ipcRenderer.invoke("minimize-window").then((result) => {});
}

function closeFrame() {
    ipcRenderer.invoke("close-window").then((result) => {});
}
