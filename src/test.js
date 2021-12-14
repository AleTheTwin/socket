const Socket = require("./socket");
main()


async function main() {
    let socket = new Socket({ wsPort: 1000 });
    socket.lookForSockets();

    bucle(socket);
}

async function bucle(socket) {
    while (true) {
        console.log(socket.listSockets().map(socket => {
            return socket.name;
        }));
        await sleep(2000)
    }
}


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}