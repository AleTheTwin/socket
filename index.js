//recuperar configuración
const fs = require('fs');
var config = require('./config.json')



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
    let actualDate = new Date(Date.now())
    let head = actualDate.getDate() + '-' + actualDate.getMonth() + '-' + actualDate.getFullYear()
    archivo.mv(config['files-path'] + head + '-' + archivo.name, err => {
        if(err) return res.status(500).send({ message : err })

        return res.status(200).send({ success : true })
    })
})

app.get('/generateAvatar', function(req, res) {
    let svg = P2pServer.generateAvatar(req.query.name, req.query.size)
    res.send(svg)
})

app.get('/changeSetting', function(req, res) {
    let key = req.query.key
    let value = req.query.value
    let actualConfig = config
    actualConfig[key] = value
    config = actualConfig

    fs.writeFileSync('./config.json', JSON.stringify(actualConfig))
    res.send({ success : true })
    
})

app.post('/newConnection', function(req, res) {
    console.log(req.body)
})

p2pServer.listen()

// window.onload = loadData

function loadData() {
    let data = P2pServer.getData()
    document.getElementById('device-name').innerHTML = data.name
    document.getElementById('device-ip').innerHTML = data.ip
    document.getElementById('device-avatar').innerHTML = data.avatar
}
