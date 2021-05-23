require("dotenv").config();

module.exports = {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    PREFIX: process.env.DISCORD_PREFIX,
    LIBRE_TRANSLATE_API: process.env.LIBRE_TRANSLATE_API,
    LIBRE_TRANSLATE_KEY: process.env.LIBRE_TRANSLATE_KEY,
    PROVIDER: process.env.PROVIDER || 'libre-translate'
};