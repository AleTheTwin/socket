const Socket = require("./socket");
const fs = require("fs");
main();


async function main() {
    let socket = new Socket({ port: 1407 }, Socket.SERVER);
    socket.lookForSockets()
}
