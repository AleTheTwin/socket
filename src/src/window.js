
function minimize() {
    ipcRenderer.invoke("minimize-window").then((result) => {});
}

async function closeFrame() {
    await socketServer.stop()
    ipcRenderer.invoke("close-window").then((result) => {});
}
