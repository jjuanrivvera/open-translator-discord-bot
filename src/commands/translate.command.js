const config = require('../config');
const axios = require('axios');
const qs = require('qs');

const { MessageEmbed } = require('discord.js');
const { PREFIX, LIBRE_TRANSLATE_API, LIBRE_TRANSLATE_KEY } = config;

module.exports = {
	name: 'translate',
	description: 'Translate',
	async execute(message) {
		const args = message.content.slice(PREFIX.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();

		try {
			const to = command;
			const textToTranslate = args.join(' ');
			const from = 'auto';

			const params = {
				api_key: LIBRE_TRANSLATE_KEY,
				q: textToTranslate,
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
	
			if (data.error) {
				console.log(data.error);
				throw new Error();
			}
			
			const embed = new MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setDescription(response.data.translatedText);

			await message.channel.send(embed);
		} catch (error) {
			console.log(error);
			await message.channel.send("Language not supported").then(msg => msg.delete({ timeout: 3000 }));
		}
	},
};