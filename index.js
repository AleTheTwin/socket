const express = require('express')
const fileUpload = require('express-fileupload')

const P2pServer = require('./p2pserver')
const HTTP_PORT = process.env.HTTP_PORT || 3000
const app = express()

const { createAvatar } = require('@dicebear/avatars')
const style = require('@dicebear/adventurer')
const fs = require('fs');

const p2pServer = new P2pServer()

app.use(express.json())
app.use(fileUpload())


app.listen(HTTP_PORT, function() {
    console.log('HTTP server listening on port ' + HTTP_PORT)
})

app.get('/sendMessage', function(req, res) {
    p2pServer.sendMessage(req.query.message)
    res.send("sent")
})

app.get('/lookForPeers', function(req, res) {
    p2pServer.connectToPeers()
    res.send('Looking for peers...')
})

app.get('/listPeers', function(req, res) {
    
    res.send(p2pServer.listPeers())
})

app.post('/upload',(req,res) => {
    let archivo = req.files.file
    archivo.mv(`./files/${archivo.name}`,err => {
        if(err) return res.status(500).send({ message : err })

        return res.status(200).send({ message : 'File upload' })
    })
})

app.get('/generateAvatar', function(req, res) {
    let svg = P2pServer.generateAvatar(req.query.name)
    res.send(svg)
})





p2pServer.listen()
