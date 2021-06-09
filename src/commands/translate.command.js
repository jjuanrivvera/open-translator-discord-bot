const { MessageEmbed } = require('discord.js');
const { languages } = require('translation-google');
const { LibreTranslate, GoogleTranslate } = require('../helpers');

module.exports = {
	name: 'translate',
	description: 'Translate a text',
	cooldown: 6,
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

			const embed = new MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL());

			if (guildModel.provider === 'google') {
				const translation = await GoogleTranslate.translate(textToTranslate, from, to);
				translatedText = translation.text;
				embed.setFooter(`${languages[translation.from.language.iso.toLowerCase()]} (${translation.from.language.iso}) -> ${languages[to]} (${to})`);
			} else {
				translatedText = await LibreTranslate.translate(textToTranslate, from, to);
			}

			translatedText = translatedText.replace(/<@! /g, `<@!`);
			translatedText = translatedText.replace(/<@ & /g, `<@&`);
			
			embed.setDescription(translatedText);

			await message.channel.send(embed);
		} catch (error) {
			console.log(error);
			await message.channel.send("Language not supported").then(msg => msg.delete({ timeout: 3000 }));
		}
	},
};