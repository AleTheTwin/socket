const express = require('express')
const fileUpload = require('express-fileupload')

const P2pServer = require('./p2pserver')
const HTTP_PORT = process.env.HTTP_PORT || 3000
const app = express()

const p2pServer = new P2pServer()

app.use(express.json())
app.use(fileUpload())


app.listen(HTTP_PORT, function() {
    console.log('HTTP server listening on port ' + HTTP_PORT)
})

app.get('/', function(req, res) {
    p2pServer.sendMessage("Hola")
    res.send("sent")
})

app.get('/lookForPeers', function(req, res) {
    p2pServer.connectToPeers()
    res.send('Looking for peers...')
})

app.get('/listPeers', function(req, res) {
    
    res.send(p2pServer.listPeers())
})


app.get('/mod', function(req, res) {
    document.getElementById("p").innerHTML = "Modificado"
    res.send("modified")
})

p2pServer.listen()
