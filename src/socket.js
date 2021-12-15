"use strict";
const EventEmitter = require("events");
const fs = require("fs");
const { shell } = require("electron");
const { default: axios } = require("axios");
const express = require("express");
const fileUpload = require("express-fileupload");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const { randomUUID } = require("crypto");
const find = require("local-devices");
const nodePortScanner = require("node-port-scanner");
const os = require("os");
const { networkInterfaces } = require("os");
const nets = networkInterfaces();

class Socket extends EventEmitter {
    constructor(options, type = Socket.CLIENT) {
        if (options === undefined || options.port === undefined) {
            throw new Error(
                "You must specify a port with (type, {port:XXXX,})."
            );
        }
        super();
        this.PORT = options.port;

        switch (type) {
            case Socket.SERVER: {
                this.localAdresses = this.getLocalAddresses();
                this.sockets = [];
                this.name = os.hostname();
                this.initServer();
                break;
            }
            case Socket.CLIENT: {
                this.token = options.token;
                this.name = options.name;
                this.address = options.address;
                this.initClient(options);
                break;
            }

            default: {
                throw new Error(
                    "Incopatible type (",
                    type,
                    ") passed to Socket constructor"
                );
            }
        }
    }

    async ping() {
        console.log("[SERVER] Looking for dead sockets.")
        this.sockets.forEach(socket => {
            try {
                let url = "http://" + socket.address + ":" + this.PORT + "/";
                axios.get(url)
            } catch (e) {
                this.disconnect(socket)
            }
        })
    }

    disconnect(socketToDelete) {
        console.log("[SERVER] Socket " + socketToDelete.name + " [" + socketToDelete.address + "] disconnected")
        this.sockets.filter(socket => {
            socket.address != socketToDelete.address 
        })
    }

    initServer() {
        console.log("Initializing Socket Server");
        this.app = express();
        this.app.use(express.json());
        this.app.use(fileUpload());
        try {
            if (!fs.existsSync("./secret.key")) {
                this.app.set("secret", randomUUID());
                fs.writeFileSync("./secret.key", this.app.get("secret"));
            } else {
                this.app.set(
                    "secret",
                    fs.readFileSync("./secret.key", {
                        encoding: "utf8",
                        flag: "r",
                    })
                );
            }
            this.app.use(bodyParser.urlencoded({ extended: true }));
            this.app.listen(this.PORT, () => {
                console.log("[SERVER] listening on port " + this.PORT + "\n");
            });
        } catch (exception) {
            console.log(exception);
            this.emit("error", {
                type: "unaccessible-port",
                message:
                    "Could not initialize Socket Server on port " + this.PORT,
            });
        }

        this.app.get("/connect", async (req, res) => {
            let address =
                req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            address = Socket.correctAddress(address);
            if (this.getSocketByAddress(address) === undefined) {
                console.log("[SERVER] Connection from " + address);
            }

            if (!(await this.isSocket(address))) {
                console.log(
                    "[SERVER] Connection refused to " +
                        address +
                        ". No Socket found."
                );
                res.status(403).json({ message: "Only sockets can connect" });
                return;
            }
            console.log("[SERVER] Connection accepted.");
            console.log("[SERVER] Pairing with Socket at 192.168.0.21.");
            this.connectToSocket(address);
            const payload = {
                check: true,
            };
            const token = jwt.sign(payload, this.app.get("secret"), {
                expiresIn: 1440,
            });

            res.json({
                message: "Connection established",
                name: this.name,
                token: token,
            });
        });

        this.app.get("/", (req, res) => {
            res.json({ isSocket: true });
        });

        //At the end of the initialization process start ping process
        setInterval(ping(), 10000)
    }

    initClient() {
        // console.log("[SERVER] Initializing Socket Client");
    }

    async lookForSockets() {
        let localDevices = await find();
        localDevices.forEach(async (device) => {
            let result = await nodePortScanner(device.ip, [this.PORT]);
            if (result.ports.open.includes(this.PORT)) {
                this.connectToSocket(device.ip);
            }
        });
    }

    getLocalAddresses() {
        let result = [];
        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
                if (net.family === "IPv4" && !net.internal) {
                    result.push(net.address);
                }
            }
        }
        return result;
    }

    async connectToSocket(address) {
        if (this.getSocketByAddress(address) !== undefined) {
            return;
        }
        let url = "http://" + address + ":" + this.PORT + "/connect";
        try {
            let response = await axios.get(url);
            if (response.status !== 200) {
                return;
            }
            let token = response.data.token;
            let name = response.data.name;
            let socket = new Socket({
                port: this.PORT,
                token: token,
                address: address,
                name: name,
            });
            this.sockets.push(socket);
            console.log(
                "[SERVER] Socket " +
                    socket.name +
                    " [" +
                    socket.address +
                    "] connected."
            );
        } catch (e) {}
    }

    getSocketByAddress(address) {
        return this.sockets.find(function (socket) {
            return socket.address === address;
        });
    }

    async isSocket(address) {
        let url = "http://" + address + ":" + this.PORT + "/";
        try {
            let response = await axios.get(url);
            if (response.data.isSocket) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }

    static correctAddress(address) {
        let aux = address.split("");
        aux = aux.reverse();
        aux = aux.join("");
        let index = aux.indexOf(":");
        if (index === -1) {
            return address;
        }
        let result = address.slice(aux.length - index);

        return result;
    }
}

//Definición de constantes para Socket
Object.defineProperty(Socket, "SERVER", {
    value: "server",
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Socket, "CLIENT", {
    value: "client",
    writable: false,
    enumerable: true,
    configurable: false,
});

module.exports = Socket;
