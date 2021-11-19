const { app, BrowserWindow } = require('electron')
const express = require('express')

const api = express()
api.use(express.json())
const port = process.env.PORT || 8080
const path = require("path")

var frame 

var isBusy = false

function createViewport() {
    frame = new BrowserWindow({
        width : 900,
        height : 620,
        fullscreenable : false,
        webPreferences : {
            nodeIntegration : true,
            contextIsolation : false,
            devTools: true
        },
        minWidth : 853,
        minHeight : 480,
        backgroundColor : "#74d3f0",
        show : false,
        frame : false,
        maximizable: false,
        resizable: false
    })

    frame.loadFile(path.join(__dirname, "index.html"))
    frame.setMenu(null)
    frame.openDevTools()
    frame.once('ready-to-show', () => {
        frame.show()
    })
}

app.on("ready", createViewport)

api.listen(port, function() {
    console.log("Module Express now listening...")
})

api.get("/minimize", function(request, response) {
    frame.minimize()
    response.send({ 
        success : true
    })
})

api.get('/isBusy', function(request, response) {
    response.send({isBusy : isBusy})
})

api.get("/close", function(request, response) {
    app.quit()
})

api.get("/maximize", function(request, response) {
    if(!frame.fullScreen) {
        frame.fullScreen = true
    } else {
        frame.fullScreen = false
    }
    response.send({
        success: true
    })
})