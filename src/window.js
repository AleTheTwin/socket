function minimize() {
    let url = "http://localhost:8080/minimize"
    axios.get(url)
    .then(function(response) {

    })
}

function maximize() {
    let url = "http://localhost:8080/maximize"
    axios.get(url)
    .then(function(response) {

    })
}

function closeFrame() {
    let url = "http://localhost:8080/close"
    axios.get(url)
    .then(function(response) {

    })
}

function volver() {
    window.open("index.html")
}