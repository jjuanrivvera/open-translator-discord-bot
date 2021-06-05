const _ = require('lodash');
const paginationEmbed = require('discord.js-pagination');
const { MessageEmbed } = require('discord.js');
const { LibreTranslate } = require('../helpers');
const { languages } = require('translation-google');

module.exports = {
	name: 'languages',
	description: 'Languages',
	cooldown: 6,
	requireArgs: 0,
	usage: `languages`,
	aliases: ['lan'],
	async execute(message, args, client, guildModel) {
		let availableLanguages = [];

		const provider = args.length ? args[0] : guildModel.provider;

		if (provider === "google") {
			availableLanguages = Object.entries(languages);
			availableLanguages = _.chunk(availableLanguages, 25);

			const pages = [];

			for (const languagesCollection of availableLanguages) {
				const embed = new MessageEmbed()
					.setAuthor(client.user.username, client.user.displayAvatarURL())
					.setDescription(`**Available Languages**`);

				for (const language of languagesCollection) {
					embed.addField(language[1], language[0], true);
				}

				pages.push(embed);
			}

			paginationEmbed(message, pages, ['⏪', '⏩'], 100000);
		} else if (provider === "libre-translate") {
			const embed = new MessageEmbed()
					.setAuthor(client.user.username, client.user.displayAvatarURL())
					.setDescription(`**Available Languages**`);
			try {
				availableLanguages = await LibreTranslate.languages();
			} catch (err) {
				return message.channel.send(`LibreTranslate is not available right now`);
			}

			for (const language of availableLanguages) {
				embed.addField(language.name, language.code, true);
			}

			return message.channel.send(embed);
		} else {
			return message.channel.send(`Provider not supported`);
		}
	},
};