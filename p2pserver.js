const webSocket = require('ws')

const os = require("os")
const deciveName = os.hostname() + ''

// const peers = process.env.PEERS ? process.env.PEERS.split(',') : []
const port = 3000
const wsPort = 5001

var ipLocal = []

let P2P_PORT = process.env.P2P_PORT || wsPort

class p2pServer {
    constructor() {
        // this.blockchain = blockchain
        this.sockets = []
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
                    name: deciveName
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
                name: deciveName
            },
            message: "Connection established"
        }
        // console.log(socket.url)
        socket.send(JSON.stringify(message))
    }

    messageHandler(socket) {
        socket.on('message', message => {
            let mensaje = JSON.parse(message)
            // console.log(mensaje)
            console.log('[' + mensaje.emiter.name + ']: ' + mensaje.message)
        })

        socket.on('message', message => {
            let mensaje = JSON.parse(message)
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
            this.sockets.push(newSocket)
        })
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

