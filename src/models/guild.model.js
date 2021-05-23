const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    id: "string",
    name: "string",
    prefix: "string",
    provider: "string",
    autoTranslate: "boolean"
});

module.exports = mongoose.model('guild', guildSchema);