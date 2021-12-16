const { render } = require("express/lib/response");
const Socket = require("./socket");
// main();

async function main() {
    const socket = new Socket({ port: 1407 }, Socket.SERVER);
    socket.lookForSockets();

    socket.on("connection", (socket) => {
        let card = SocketCard(socket);
        render(card, $("device-container"));
    });

    socket.on("disconnection", (disconnectedSocket) => {
        //TODO:
    });
}

let file = {
    name: "imagen.png",
};

// console.log(renameFile(file, 0))
for (let i = 0; i < 3; i++) {
    renameFile(file, i);
}

function renameFile(file, count) {
    let aux = file.name;
    aux = aux.split("").reverse().join("");
    aux = aux.slice(aux.indexOf(".") + 1);
    let name = aux.split("").reverse().join("");
    let extension = file.name.slice(file.name.indexOf("."));

    let plus = " (" + (count + 1) + ")";
    name = name + plus;
    returnname + extension;
}
