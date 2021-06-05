const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'prefix',
	description: 'Manage prefix',
	cooldown: 6,
	aliases: ['p'],
	usage: "prefix [prefix]",
	example: "prefix +",
	async execute(message, args, client, guildModel) {
		if (!args.length) {
			const embed = new MessageEmbed()
				.setAuthor(client.user.username, client.user.displayAvatarURL())
				.setDescription(`Current prefix: \`${guildModel.prefix}\``);

			return message.channel.send(embed);
		}

		guildModel.prefix = args[0];
		await guildModel.save();
		
		const embed = new MessageEmbed()
			.setAuthor(client.user.username, client.user.displayAvatarURL())
			.setDescription(`Prefix changed`);

		await message.channel.send(embed);
	},
};