const webSocket = require('ws')

const axios = require('axios').default;

const os = require("os")
const deviceName = os.hostname() + ''

// const peers = process.env.PEERS ? process.env.PEERS.split(',') : []
const port = 3000
const wsPort = 5001
const { createAvatar } = require('@dicebear/avatars')
const style = require('@dicebear/adventurer')

var ipLocal

let P2P_PORT = process.env.P2P_PORT || wsPort

class p2pServer {
    constructor() {
        // this.blockchain = blockchain
        this.sockets = []
        p2pServer.generateAvatar(deviceName)
    }

    static generateAvatar(name, size) {
        return createAvatar(style, {
            seed: name || 'seed',
            size: size || 40,
            backgroundColor: "#ABFD9E",
            radius: 50
            // ... and other options
            }
        );
    }

    sendConfirmation(ip) {
        let sendTo = this.getSocketByIp(ip)
        if(sendTo !== undefined) {
            let url = "http://" + sendTo.address + ":" + port + "/fileRecieved"
            axios.get(url)
        }
        return sendTo
    }

    async close() {
        this.sendMessage("Disconnected")
        await sleep(300)
        let url = "http://localhost:8080/close"
        axios.get(url)
    }

    static getData() {
        return {
            name: deviceName,
            ip: ipLocal,
            avatar: p2pServer.generateAvatar(deviceName)
        }
    }

    listen() {
        this.server = new webSocket.Server({port: P2P_PORT})
        console.log("Listening for p2p connections on port " + P2P_PORT)
        this.connectToPeers()
        this.server.on('connection', (socket) => {
            this.connecctSocket(socket)
        })
    }

    sendMessage(message) {
        this.sockets.forEach(socket => {
            let mensaje = {
                emiter: {
                    address: ipLocal,
                    name: deviceName
                },
                message: message
            }
            socket.socket.send(JSON.stringify(mensaje))
            console.log('Message sent')
        })
        
    }

    connecctSocket(socket) {
        // this.sockets.push(socket)
        // console.log('[+] New socket connected from: ' + ip)
        this.messageHandler(socket)
        
        let message = {
            emiter: {
                address: ipLocal,
                name: deviceName
            },
            message: "Connection established"
        }
        // console.log(socket.url)
        socket.send(JSON.stringify(message))
    }

    messageHandler(socket) {
        socket.on('message', message => {
            let mensaje = JSON.parse(message)
            if(mensaje.message == "Connection established") {

                //Se espera un objeto con la siguiente estructura
                // var messageData = {
                //     emiter: {
                //         address: [],
                //         name: 'NombreDelSocket'
                //     },
                //     message: 'Connection established',
                // }
                
                let newSocket = {
                    name: mensaje.emiter.name,
                    address: mensaje.emiter.address,
                    socket: socket           
                }
                if(this.getSocketByName(newSocket.name) === undefined) {
                    this.sockets.push(newSocket)
                    let url = "http://localhost:3000/newConnection"
                    axios.post(url, {
                        name: newSocket.name, 
                        address: newSocket.address
                    })
                }
            } else if(mensaje.message == "Disconnected") {
                let disconnected = this.getSocketByName(mensaje.emiter.name)
                removeItemFromArr(this.sockets, disconnected)
                let url = "http://localhost:3000/removeFromView?name=" + disconnected.name
                axios.get(url)
            }
            // console.log(mensaje)
            console.log('[' + mensaje.emiter.name + ']: ' + mensaje.message)
        })

        // socket.on('message', message => {
        //     let mensaje = JSON.parse(message)
            
            
            
        // })
    }

    listPeers() {
        let socketList = []
        this.sockets.forEach(socket => {
            let sock = {
                name: socket.name,
                address: socket.address
            }
            socketList.push(sock)
        })  
        return socketList
    }

    getSocketByName(name) {
        //Returns a socket that matches with the name, or undefined if it doesn't exist
        return this.sockets.find(function(socket) {
            return socket.name === name
        })
    }

    getSocketByIp(ip) {
        console.log(ip)
        //Returns a socket that matches with the name, or undefined if it doesn't exist
        return this.sockets.find(function(socket) {
            // return socket.ip.includes(ip)
            return ip.includes(socket.address)
        })
    }

    isSocketOwnedBy(name, socket) {
        // return socket.name === name
        console.log(name + ":" + socket.name)
    }

    async connectToPeers() {
        const nodePortScanner = require('node-port-scanner')

        const { networkInterfaces } = require('os');

        const nets = networkInterfaces();
        const results = Object.create(null);

        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
                if (net.family === 'IPv4' && !net.internal) {
                    if(net.address.includes('192.168.0') || net.address.includes('192.168.3')) {
                        if (!results[name]) {
                            results[name] = [];
                        }
                        results[name].push(net.address);
                    }
                }
            }
        }

        var localAdresses = []

        for(const interfaceName of Object.keys(results)) {
            localAdresses.push(results[interfaceName][0])
        }

        ipLocal = localAdresses[0]
        await sleep(500)
        const find = require('local-devices');

        // Find all local network devices.
        var localDevices = []
        await find()
        .then(devices => {
            localDevices = devices
        })
        var resultado
        localDevices.forEach(async device => {
            if(!(localAdresses.includes(device.ip))) {
                await nodePortScanner(device.ip, [port])
                .then(function(result) {
                    resultado = result
                }) 
                if(resultado.ports.open.includes(port)) {
                    var peer = "ws://" + resultado.host + ':' + wsPort
                    var socket = new webSocket(peer)
                    socket.on('open', () => {
                        this.connecctSocket(socket)
                    })
                }
            }
        })
    }
}

function removeItemFromArr (arr , item) {
    var i = arr.indexOf( item );
 
    if ( i !== -1 ) {
        arr.splice( i, 1 );
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports = p2pServer

