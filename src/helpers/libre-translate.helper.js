const axios = require('axios');
const qs = require('qs');

const config = require('../config');
const { LIBRE_TRANSLATE_API, LIBRE_TRANSLATE_KEY } = config;

module.exports = {
    async translate (text, from, to) {
        const params = {
            api_key: LIBRE_TRANSLATE_KEY,
            q: text,
            source: from,
            target: to
        };
      
        const url = `${LIBRE_TRANSLATE_API}/translate`;
        const data = qs.stringify(params);
              
        const response = await axios({
            method: "POST",
            url: url,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: data,
        });

        if (response.data.error) {
            console.log(data.error);
            throw new Error();
        }

        return response.data.translatedText
    },

    async languages() {
        const url = `${LIBRE_TRANSLATE_API}/languages`;
              
        const response = await axios({
            method: "GET",
            url: url
        });

        if (response.data.error) {
            console.log(data.error);
            throw new Error();
        }

        return response.data
    }
}