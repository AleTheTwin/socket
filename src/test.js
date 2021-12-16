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


let localDevices = [
    {ip: "127.0.0.1"},
    {ip: "127.0.0.2"},
    {ip: "127.0.0.3"},
    {ip: "127.0.0.1"},    
    {ip: "127.0.0.1"},    
    {ip: "127.0.0.1"},    
];
let aux = []
localDevices.forEach(device => {
    let res = aux.find(function (dev) {
        return device.ip === dev.ip;
    });
    if(res === undefined) {
        aux.push(device);
    }
})
console.log(aux)
