const Socket = require("./socket");
main()


async function main() {
    let socket = new Socket({ wsPort: 1000 });
    socket.lookForSockets();
}
