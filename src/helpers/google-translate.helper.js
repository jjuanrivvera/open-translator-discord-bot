const translate = require('translation-google');

module.exports = {
    async translate(text, from, to) {
        const translation = await translate(text, { to: to });

        return translation.text;
    }
}