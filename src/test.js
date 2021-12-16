const { render } = require("express/lib/response");
const Socket = require("./socket");
main();


async function main() {
    const socket = new Socket({ port: 1407 }, Socket.SERVER);
    socket.lookForSockets()

    socket.on('connection', socket => {
        let card = SocketCard(socket);
        render(card, $("device-container"))
    })

    socket.on('disconnection', disconnectedSocket => {
        //TODO: 
    })
}
