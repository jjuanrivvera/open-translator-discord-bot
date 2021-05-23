const { MessageEmbed } = require('discord.js');
const { LibreTranslate } = require('../helpers');

module.exports = {
	name: 'languages',
	description: 'Languages',
	cooldown: 6,
	aliases: ['lan'],
	async execute(message, args, client) {
		const languages = await LibreTranslate.languages();
		
		const embed = new MessageEmbed()
			.setAuthor(client.user.username, client.user.displayAvatarURL())
			.setDescription(`Availabe Languages`);

		for (const [index, language] of languages.entries()) {
			const inline = index%2 === 0 ? false : true;
			embed.addField(language.name, language.code, inline);
		}

		await message.channel.send(embed);
	},
};