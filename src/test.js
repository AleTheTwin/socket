
const FormData = require('form-data');
const fs = require('fs');
const {shell} = require('electron') 
const path = require("path")
const { default: axios } = require('axios');

async function send(){
    var formdata = new FormData();
    let fileStream = await fs.createReadStream("D:/Proyectos/node js/socket/src/test/mensaje.txt")
    formdata.append("file", fileStream);
    let url = "http://192.168.0.6:3000/upload"
    axios.post(url, formdata, {
        headers: {
            ...formdata.getHeaders()
        }
    })
    .then(function(response) {
        // console.log(response)
        console.log("listo")
    })
    .catch(function(err) {
        console.log(err)
    })
}

send()