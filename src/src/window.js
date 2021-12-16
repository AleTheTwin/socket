function minimize() {
    ipcRenderer.invoke("minimize-window").then((result) => {});
}

async function closeFrame() {
    try {
        await socketServer.stop();
    } catch (e) {
        console.log(e);
    }
    ipcRenderer.invoke("close-window").then((result) => {});
}
