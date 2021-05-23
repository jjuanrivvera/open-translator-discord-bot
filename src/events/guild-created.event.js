const config = require('../config');
const { PREFIX } = config;

const { Guild } = require('../models');

module.exports = {
	name: 'guildCreate',
	async execute(guild) {
        await Guild.create({
            id: guild.id,
            name: guild.name,
            prefix: PREFIX,
            provider: "google",
            autoTranslate: false
        });

        console.log(`I have joined ${guild.name} server`);
	}
};