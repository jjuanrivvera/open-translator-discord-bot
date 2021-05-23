const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'provider',
	description: 'Provider',
	cooldown: 6,
	usage: "provider <provider>",
	requireArgs: 1,
	example: "provider google|libre-translate",
	async execute(message, args, client, guildModel) {

		if (args[0] !== 'google' && args[0] !== 'libre-translate') {
			return message.channel.send(`Provider not supported`).then(msg => msg.delete({ timeout: 3000 }));
		}

		guildModel.provider = args[0];
		await guildModel.save();
		
		const embed = new MessageEmbed()
			.setAuthor(client.user.username, client.user.displayAvatarURL())
			.setDescription(`Provider changed`);

		await message.channel.send(embed);
	},
};