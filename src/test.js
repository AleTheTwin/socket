
const { default: axios } = require("axios");
var FormData = require("form-data");
const fs = require('fs/promises');

main()

async function main(){// Read image from disk as a Buffer
const image = await fs.readFile("D:/OneDrive - Universidad Veracruzana/Imágenes/123.png");

// Create a form and append image with additional fields
const form = new FormData();
form.append('productName', 'Node.js Stickers');
form.append('productDescription', 'Cool collection of Node.js stickers for your laptop.');
form.append('file', image, 'stickers.jpg');

// Send form data with axios
const response = await axios.post('http://192.168.0.21:1407/upload', form, {
  headers: {
    ...form.getHeaders(),
    Authentication: 'Bearer ...',
  },
});}