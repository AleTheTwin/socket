const Socket = require("./socket");
const ipcRenderer = require("electron").ipcRenderer;

const socket = new Socket({ port: 1407 }, Socket.SERVER);
socket.lookForSockets();

window.onload = renderData(socket);

socket.on("connection", (socket) => {
    let card = SocketCard(socket);
    render(card, "device-container");
});

socket.on("disconnection", (disconnectedSocket) => {
    derender(disconnectedSocket.name + "-card");
});
