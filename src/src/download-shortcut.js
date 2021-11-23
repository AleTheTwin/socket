loadQRCode()

async function loadQRCode() {
    let url = "http://localhost:3000/getData"
    let response = await axios.get(url)
    var qrcode = new QRCode(document.getElementById("qr-code"), {
        text: "http://" + response.data.ip + ":3000/downloadShortcut",
        width: 400,
        height: 400,
        colorDark : "#ABFD9E",
        colorLight : "#36393f",
        correctLevel : QRCode.CorrectLevel.H
    });
}