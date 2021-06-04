const { MessageEmbed } = require('discord.js');
const { LibreTranslate, GoogleTranslate } = require('../helpers');

module.exports = {
	name: 'translate',
	description: 'Translate',
	cooldown: 6,
	aliases: ['t'],
	usage: "<language> <text>",
	requireArgs: 1,
	example: "en ¡Hola! Este es el traductor.",
	async execute(message, args, client, guildModel) {
		const arguments = message.content.slice(guildModel.prefix.length).trim().split(/ +/);
		const command = arguments.shift().toLowerCase();

		try {
			const to = command;
			const textToTranslate = arguments.join(' ');
			const from = 'auto';

			let translatedText = null;

			if (guildModel.provider === 'google') {
				translatedText = await GoogleTranslate.translate(textToTranslate, from, to);
			} else {
				translatedText = await LibreTranslate.translate(textToTranslate, from, to);
			}

			translatedText = translatedText.replace(/<@! /g, `<@!`);
			
			const embed = new MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setDescription(translatedText);

			await message.channel.send(embed);
		} catch (error) {
			console.log(error);
			await message.channel.send("Language not supported").then(msg => msg.delete({ timeout: 3000 }));
		}
	},
};