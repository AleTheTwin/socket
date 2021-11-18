
const { app, BrowserWindow } = require('electron')

const path = require("path")

var frame 

function createViewport() {
    frame = new BrowserWindow({
        width : 853,
        height : 480,
        fullscreenable : true,
        webPreferences : {
            nodeIntegration : true,
            contextIsolation: false,
            devTools: true
        },
        minWidth : 853,
        minHeight : 480,
        backgroundColor : "#74d3f0",
        show : false,
        frame : false
    })
    frame.loadFile(path.join(__dirname, "index.html"))
    frame.setMenu(null)
    frame.openDevTools()
    frame.once('ready-to-show', () => {
        frame.show()
    })
}

app.on("ready", createViewport)
