
const FormData = require('form-data');
const fs = require('fs');
const {shell} = require('electron') 
const path = require("path")
const { default: axios } = require('axios');

async function send(){
    var formdata = new FormData();
    let fileStream = await fs.createReadStream("D:/Proyectos/node js/socket/src/test/prueba.txt")
    formdata.append("file", fileStream);
    formdata.append("ip", "192.168.0.4");
    formdata.append("name", "alethetwin");
    let url = "http://192.168.0.4:3000/upload"
    axios({
        method: 'post',
        url: url,
        data: formdata,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {'Content-Type': 'multipart/form-data;boundary=' + formdata.getBoundary()}
    })
    // axios.post(url, formdata, {
    //     headers: {
    //         ...formdata.getHeaders()
    //     },
    //     'maxContentLength': Infinity,
    //     'maxBodyLength': Infinity
    // })
    .then(function(response) {
        // console.log(response)
        console.log("listo")
    })
    .catch(function(err) {
        console.log(err.message)
    })
}

// send()

function print(data) {
    console.log(data)
}

timer(5, print)

async function timer(seconds, __callback) {
    while(seconds >= 0) {
        // console.log(seconds)
        __callback(seconds)
        await sleep(1000)
        seconds--
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
