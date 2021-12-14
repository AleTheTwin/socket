const Socket = require("./socket");
main();

async function main() {
    let socket = new Socket({ wsPort: 1000 });
    socket.lookForSockets();

    bucle(socket);
}

async function bucle(socket) {
    let count = 0;
    while (true) {
        let si = socket.listSockets().map((socket) => {
            return socket.name;
        });
        if (si.length > count) {
            console.log(si);
            count++;
        }
        await sleep(2000);
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
