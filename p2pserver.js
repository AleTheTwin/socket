const webSocket = require('ws')

const peers = process.env.PEERS ? process.env.PEERS.split(',') : []
const port = 3000
const wsPort = 5001
const ipInitial = 1
const ipFinal = 25

// lookForPeers()


let P2P_PORT = process.env.P2P_PORT || 5001

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
        this.server.on('connection', socket => this.connecctSocket(socket))
        this.server.on('message', message => {
            console.log("Recivendo mensaje...")
        })
    }

    sendMessage(message) {
        // this.server.send(message)
        this.sockets.forEach(socket => {
            socket.send(message)
            console.log('Message sent')
            socket.send('Hola, acabas de conectar conmigo')
        })
        
    }

    connecctSocket(socket) {
        this.sockets.push(socket)
        console.log('[+] New socket connected')
        this.messageHandler(socket)
    }

    messageHandler(socket) {
        socket.on('message', message => {
            console.log(message)
        })
    }

    listPeers() {
        return this.sockets
    }

    async connectToPeers() {
    
        const nodePortScanner = require('node-port-scanner')

        const { networkInterfaces } = require('os');

        const nets = networkInterfaces();
        const results = Object.create(null); // Or just '{}', an empty object

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

        const find = require('local-devices');

        // Find all local network devices.
        var localDevices = []
        await find()
        .then(devices => {
            localDevices = devices
        })

        localDevices.forEach(async device => {
            if(!(localAdresses.includes(device.ip))) {
                var resultado
                await nodePortScanner(device.ip, [port])
                .then(function(result) {
                    resultado = result
                }) 
                if(resultado.ports.open.includes(port)  && resultado.host != "192.168.0.4") {
                    console.log(resultado)
                    var peer = "ws://" + resultado.host + ':' + 5001
                    // console.log(resultado.host)
                    // hosts.push(result.host)
                    var socket = new webSocket(peer)
                    socket.on('open', () => {
                        this.connecctSocket(socket)
                        socket.send("Hola")
                    })
                }
            }
        })
    }
}

module.exports = p2pServer

