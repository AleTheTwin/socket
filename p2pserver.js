const webSocket = require('ws')

// const peers = process.env.PEERS ? process.env.PEERS.split(',') : []
const port = 3000
const wsPort = 5001

var ipLocal = []

let P2P_PORT = process.env.P2P_PORT || wsPort

class p2pServer {
    constructor() {
        // this.blockchain = blockchain
        this.sockets = []
        this
    }

    listen() {
        this.server = new webSocket.Server({port: P2P_PORT})
        console.log("Listening for p2p connections on port " + P2P_PORT)
        this.connectToPeers()
        this.server.on('connection', (socket, req) => {
            this.connecctSocket(socket, req.socket.remoteAddress)
            // console.log('connection from ' + socket.url)
        })
    }

    sendMessage(message) {
        this.sockets.forEach(socket => {
            let mensaje = {
                emiter: ipLocal,
                message: message
            }
            socket.send(JSON.stringify(mensaje))
            console.log('Message sent')
            // socket.send(JSON.stringify({ message: message }))
        })
        
    }

    sendFile(file) {
        this.sockets.forEach(socket => {
            console.log('File sent')
            socket.emit('file', file)
        })
        
    }

    connecctSocket(socket, ip) {
        this.sockets.push(socket)
        // console.log('[+] New socket connected from: ' + ip)
        this.messageHandler(socket)
        
        let message = {
            emiter: ipLocal,
            message: "Connection established"
        }
        // console.log(socket.url)
        socket.send(JSON.stringify(message))
    }

    messageHandler(socket) {
        socket.on('message', message => {
            let mensaje = JSON.parse(message)
            console.log(mensaje)
        })

        socket.on('file', file => {
            console.log("Recibiendo archivo")
        })
    }

    listPeers() {
        return this.sockets
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
                    if (!results[name]) {
                        results[name] = [];
                    }
                    results[name].push(net.address);
                }
            }
        }

        var localAdresses = []

        for(const interfaceName of Object.keys(results)) {
            localAdresses.push(results[interfaceName][0])
        }

        ipLocal = localAdresses

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

module.exports = p2pServer

