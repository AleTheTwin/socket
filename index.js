//recuperar configuración
const fs = require('fs');
var config = require('./config.json')
const {shell} = require('electron') 



const express = require('express')
const fileUpload = require('express-fileupload')

const P2pServer = require('./p2pserver')
const HTTP_PORT = process.env.HTTP_PORT || 3000
const app = express()

const axios = require('axios').default;

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

    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress ;
    let head = actualDate.getDate() + '-' + actualDate.getMonth() + '-' + actualDate.getFullYear() + '-' + actualDate.getHours() + ':' + actualDate.getMinutes() + ':' + actualDate.getSeconds()
    archivo.mv(config['files-path'] + head + '-' + archivo.name, err => {
        if(err) return res.status(500).send({ message : err })
        let socket = p2pServer.sendConfirmation(ip)
        recievedConfirmation(config['files-path'] + head + '-' + archivo.name, socket)
        return res.send({ success: true })
    })
})

app.get('/generateAvatar', function(req, res) {
    let svg = P2pServer.generateAvatar(req.query.name, req.query.size)
    res.send(svg)
})

app.get('/fileRecieved', function(req, res) {
    // closeModal()
    let selectionContainer = document.getElementById('select-container')
    selectionContainer.innerHTML = "<p>File sent ✅</p>"
    res.send({ success : true})
})

app.get('/close', function(req, res) {
    let url = "http://localhost:8080/isBusy"
    axios.get(url)
    .then(function(response) {
        if(response.data.isBusy) {
            //en caso de estar ocupado
        } else {
            p2pServer.close()
        }
    })
})

app.get('/removeFromView', function(req, res) {
    let name = req.query.name
    let card = document.getElementById(name + "-card")
    let deviceContainer = document.getElementById('device-container')
    deviceContainer.removeChild(card)
    if(p2pServer.sockets.length == 0) {
        // let searchText = '<p class="searching">Searching for devices...</p>'
        // deviceContainer.innerHTML = searchText
        writeSearchingText()
    }
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
    // console.log(req.body)
    renderCard(req.body)
    res.send({ success : true })
})

// app.get("/openExplorer", function(request, response) {
//     let path = request.query.path
//     shell.openPath(path) 
// })

async function loadData() {
    p2pServer.listen()
    await sleep(500)
    let data = P2pServer.getData()
    document.getElementById('device-name').innerHTML = data.name
    document.getElementById('device-ip').innerHTML = data.ip
    document.getElementById('device-avatar').innerHTML = data.avatar
    writeSearchingText()
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}



function renderCard(device) {
    // let card = '<div class="device-card" id="' + device.name + '-card">\
    // <div class=" avatar avatar-card" id="' + device.name + '-avatar">' +  P2pServer.generateAvatar(device.name, 80)  + '</div>\
    //     <div class="device-info">\
    //         <div class="info info-card">\
    //             <h1>' + device.name + '</h1>\
    //             <small>' + device.address + '</small>\
    //         </div>\
    //     </div>\
    //     <div class="device-info btn btn-send">\
    //         <div class="info info-card">\
    //             <h1>Send file</h1>\
    //         </div>\
    //     </div>\
    // </div>'

    let card = '\
    <div class="device-card" id="' + device.name + '-card">\
        <div class="card-content">\
            <div class=" avatar avatar-card" id="' + device.name + '-avatar">' +  P2pServer.generateAvatar(device.name, 80)  + '</div>\
            <div class="device-info">\
                <div class="info info-card">\
                    <h1>' + device.name + '</h1>\
                    <small>' + device.address + '</small>\
                </div>\
            </div>\
            <div class="device-info btn btn-send">\
                <div onclick="selectionFrame(' + "'"  + device.name + "','" + device.address + "'" + ')" id="' + device.name + '-send" class="info info-card">\
                    <h1>Send file</h1>\
                </div>\
            </div>\
        </div>\
        <div class="select-file"></div>\
    </div>\
    '
    let deviceContainer = document.getElementById('device-container')
    if(deviceContainer.innerHTML.includes('<p class="searching">Searching for devices...</p>') || deviceContainer.innerHTML.includes('Look for devices')) {
        deviceContainer.innerHTML = card
    } else {
        deviceContainer.innerHTML += card
    }
}

function lookForDevices() {
    writeSearchingText()
    p2pServer.connectToPeers()
}

async function writeSearchingText() {
    let deviceContainer = document.getElementById('device-container')
    let searchText = '<p class="searching">Searching for devices...</p>'
    deviceContainer.innerHTML = searchText
    await sleep(5000)
    if(p2pServer.sockets.length == 0) {
        let button = '<div onclick="lookForDevices()" class="btn searching">\
                            <h1>Look for devices</h1>\
                        </div>'
        deviceContainer.innerHTML = button
    }
}

function openInExplorer(path) {
    shell.openPath(path)
}

async function recievedConfirmation(path, socket) {
    let modalContainer = document.getElementById('modal-content')
    modalContainer.innerHTML = '\
    <div id="device-selected" class="device-selected">\
        <div class="device-card">\
            <div class="card-content">\
                <div class=" avatar avatar-card" id="device-selected-avatar"></div>\
                <div class="device-info">\
                    <div class="info info-card">\
                        <h1 id="device-selected-name"></h1>\
                        <small id="device-selected-ip"></small>\
                    </div>\
                </div>\
            </div>\
            <div id="select-container" class="select-file"></div>\
        </div>\
    </div>\
    '

    let avatar = document.getElementById(socket.name + '-avatar').innerHTML
    document.getElementById('device-selected-name').innerHTML = socket.name
    document.getElementById('device-selected-ip').innerHTML = socket.address
    document.getElementById('device-selected-avatar').innerHTML = avatar
    openModal()
    
    let selectionContainer = document.getElementById('select-container')
    await sleep(750)
    selectionContainer.classList.add('select-file-space')
    await sleep(750)
    selectionContainer.innerHTML = '<p>File recieved ✅</p>\
    <div>\
        <div class="device-info btn btn-send" onclick="openInExplorer(' + "'" + path + "'" + ')">\
            <div class="info info-card">\
                <h1>Open File</h1>\
            </div>\
        </div>\
        <div class="device-info btn btn-send" onclick="openInExplorer(' + "'" + config['files-path'] + "'" + ')">\
            <div class="info info-card">\
                <h1>Show in folder</h1>\
            </div>\
        </div>\
    </div>\
        '

}

window.onload = loadData