const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'prefix',
	description: 'Prefix',
	cooldown: 6,
	aliases: ['p'],
	usage: "prefix <prefix>",
	requireArgs: 1,
	example: "prefix +",
	async execute(message, args, client, guildModel) {
		if (!args.length) {
			return;
		}

		guildModel.prefix = args[0];
		await guildModel.save();
		
		const embed = new MessageEmbed()
			.setAuthor(client.user.username, client.user.displayAvatarURL())
			.setDescription(`Prefix changed`);

		await message.channel.send(embed);
	},
};