const { default: axios } = require('axios')

let hosts = []
lookForPeers()

var url = "http://localhost/src/php/functions/wait.php?segundos=5"
axios.get(url, function(response) {
    console.log(hosts)
})

async function lookForPeers() {
    const ipInitial = 1
    const ipFinal = 4

    const nodePortScanner = require('node-port-scanner')

    for(var i = ipInitial; i <= ipFinal+1; i++) {
        var ip = "192.168.0." + i
        var results = nodePortScanner(ip, [80])
        .then(function(result) {
            if(result.ports.open.includes(3000)) {
                console.log(result)
                console.log(result.host)
                hosts.push(result.host)
            }
        })  
    }
}