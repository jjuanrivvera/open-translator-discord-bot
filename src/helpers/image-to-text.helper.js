const axios = require('axios');
const Tesseract = require('tesseract.js');
const { OCR_URL } = require('../config');

module.exports = {
    async extractImageTextLambda(imageUrl) {
        const response = await axios({
            method: "POST",
            url: OCR_URL,
            data: JSON.stringify({
                image: imageUrl
            })
        });

        return response.data.text;
    },

    async extractImageText(imageUrl) {
        const worker = Tesseract.createWorker({
            logger: m => console.log(m)
        });

        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');

        const { data: { text } } = await worker.recognize(imageUrl);

        await worker.terminate();

        return text;
    }
}