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
const find = require('local-devices');
const nodePortScanner = require("node-port-scanner");
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

        this.token = undefined;
        this.address = "";
        this.sockets = [];
        this.localAdresses = this.getLocalAddresses()

        switch (type) {
            case Socket.SERVER: {
                this.initServer();
                break;
            }
            case Socket.CLIENT: {
                this.initClient();
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
            console.log(this.app.get("secret"));
            this.app.use(bodyParser.urlencoded({ extended: true }));
            this.app.listen(this.PORT, () => {
                console.log("listening on port " + this.PORT);
            });
        } catch (exception) {
            console.log(exception);
            this.emit("error", {
                type: "unaccessible-port",
                message:
                    "Could not initialize Socket Server on port " + this.PORT,
            });
        }

        this.app.get("/connection", async (req, res) => {
            let address =
                req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            console.log("Connection from " + address);
            address = Socket.correctaddress(address);

            if (!(await this.isSocket(address))) {
                res.status(403).json({ message: "Only sockets can connect" });
                return;
            }

            const payload = {
                check: true,
            };
            const token = jwt.sign(payload, this.app.get("secret"), {
                expiresIn: 1440,
            });

            res.json({
                message: "Connection established",
                token: token,
            });
        });

        this.app.get("/", (req, res) => {
            res.json({ isSocket: true });
        });
    }

    initClient() {
        console.log(
            "Initializing Socket Client, trying to establish connection with " +
                this.PORT
        );
    }

    async lookForSockets() {
        let localDevices = await find()
        localDevices.forEach(async device => {
            let result = await nodePortScanner(device.ip, [this.PORT])
            if(result.ports.open.includes(this.PORT)) {
                this.connectToSocket(device.ip)
            }
        })
    }

    getLocalAddresses() {
        let result = []
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
        let url = "http://" + address + ":" + this.PORT;

        if (this.getSocketByAddress(address) !== undefined) {
            return;
        }

        try {
            let response = await axios.get(url);
            if (response.status !== 200) {
                return;
            }
            let token = response.data.token;
            let socket = new Socket({ port: this.PORT, token: token });
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
