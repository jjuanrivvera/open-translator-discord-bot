const config = require('../config');
const sentry = require('../config/sentry');
const { PREFIX } = config;
const { Guild } = require('../models');

module.exports = {
	name: 'guildCreate',
	async execute(guild) {
        try {
            await Guild.create({
                id: guild.id,
                name: guild.name,
                prefix: PREFIX,
                provider: "google",
                autoTranslate: false
            });
    
            console.log(`I have joined ${guild.name} server`);
        } catch (error) {
            sentry.captureException(error);
        }
	}
};