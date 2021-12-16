const Socket = require("./socket");
const { shell } = require("electron");
const ipcRenderer = require("electron").ipcRenderer;

const socketServer = new Socket({ port: 1407 }, Socket.SERVER);
socketServer.lookForSockets();

window.onload = renderData(socketServer);

socketServer.on("connection", (socket) => {
    let card = SocketCard(socket);
    render(card, "device-container");
});

socketServer.on("disconnection", (disconnectedSocket) => {
    derender(disconnectedSocket.name + "-card");
});
