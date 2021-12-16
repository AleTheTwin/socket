function minimize() {
    ipcRenderer.invoke("minimize-window").then((result) => {});
}

async function closeFrame() {
    try {
        await socketServer.stop();
        ipcRenderer.invoke("close-window").then((result) => {});
    } catch (e) {
        console.log(e);
    }
    
}
