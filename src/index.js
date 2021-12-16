const Socket = require("./socket");

const socket = new Socket({ port: 1407 }, Socket.SERVER);
socket.lookForSockets();

window.onload = renderData(socket)

socket.on("connection", (socket) => {
    let card = SocketCard(socket);
    render(card, "device-container")
});

socket.on("disconnection", (disconnectedSocket) => {
    let id = disconnectedSocket.name + "-card"
    console.log(id)
    derender(id);
});
