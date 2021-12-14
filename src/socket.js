"use strict";

const WebSocket = require("ws");
const axios = require("axios").default;
const os = require("os");
const nodePortScanner = require("node-port-scanner");
const { networkInterfaces } = require("os");

const { createAvatar } = require("@dicebear/avatars");
const style = require("@dicebear/adventurer");

class Socket {
    constructor(config) {
        this.server = new WebSocket.Server({
            port: config ? config.wsPort : 5001,
        });

        this.server.on("connection", (socket, req) => {
            let ip = this.ipCorrect(req.socket.remoteAddress);
            this.listenToSocket(socket, ip);
        });

        console.log(
            "Listening for socket connections on port: " +
                (config ? config.wsPort : 5001) +
                " from address: ",
            this.getLocalAdresses()
        );
        this.sockets = [];
        this.name = os.hostname();
        this.wsPort = config ? config.wsPort : 5001;
        this.apiPort = config ? config.apiPort : 3000;
        this.avatar = Socket.generateAvatar(this.name);
        this.localAdresses = this.getLocalAdresses();
    }

    static generateAvatar(name, size) {
        return createAvatar(style, {
            seed: name || "seed",
            size: size || 40,
            backgroundColor: "#ABFD9E",
            radius: 50,
        });
    }

    async lookForSockets() {
        const find = require("local-devices");
        var localDevices = await find();

        localDevices.forEach(async (device) => {
            let result = await nodePortScanner(device.ip, [this.wsPort]);
            if (
                result.ports.open.includes(this.wsPort) &&
                !this.localAdresses.includes(device.ip)
            ) {
                this.connectToSocket(device.ip);
            }
        });
    }

    connectToSocket(ip) {
        console.log("Connecting to socket on [", ip, "]");
        let socketAddress = "ws://" + ip + ":" + this.wsPort;
        let socket = new WebSocket(socketAddress);
        socket.on("open", () => {
            console.log("Socket connected at [", ip, "]");
            let message = JSON.stringify({ type: "request-info" });
            socket.send(message);
            this.listenToSocket(socket, ip);
        });
    }

    listenToSocket(socket, ip) {
        socket.on("message", (message) => {
            message = JSON.parse(message);
            switch (message.type) {
                case "request-info":
                    let data = {
                        type: "socket-info",
                        socket: {
                            name: this.name,
                        },
                    };
                    socket.send(JSON.stringify(data));
                    break;
                case "socket-info":
                    let newSocket = {
                        socket: socket,
                        name: message.socket.name,
                        ip: ip,
                    };
                    this.sockets.push(newSocket);
                    break;
                case "message":
                    console.log(message.message);
            }
        });
    }

    listSockets() {
        return this.sockets
    }

    getLocalAdresses() {
        const localAdresses = [];
        const nets = networkInterfaces();
        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                // Ignore non-IPv4 and internal addresses
                if (net.family === "IPv4" && !net.internal) {
                    localAdresses.push(net.address);
                }
            }
        }
        return localAdresses;
    }

    toString() {
        let str = "Socket: " + this.name + "\n";
        str += "ws port: " + this.wsPort + "\n";
        str += "api port: " + this.apiPort + "\n";
        return str;
    }

    ipCorrect(ip) {
        let aux = ip.split("");
        aux = aux.reverse();
        aux = aux.join("");
        let index = aux.indexOf(":");
        let result = ip.slice(ip.length - index);
        return result;
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports = Socket;
