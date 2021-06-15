const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'provider',
	description: 'Manage translate provider',
	cooldown: 6,
	usage: "provider <provider>",
	supportedProviders: [
		"google",
		"libre-translate"
	],
	requireArgs: 0,
	example: "provider google|libre-translate",
	accessibility: "admin",
	clientPermissions: [
		"SEND_MESSAGES",
		"EMBED_LINKS"
	],
	async execute(message, args, client, guildModel) {
		if (!args.length) {
			const embed = new MessageEmbed()
				.setAuthor(client.user.username, client.user.displayAvatarURL())
				.setDescription(`Current provider: \`${guildModel.provider}\``);

			return message.channel.send(embed);
		}

		if (!this.supportedProviders.includes(args[0])) {
			return message.channel.send(`Provider not supported`).then(msg => msg.delete({ timeout: 3000 }));
		}

		guildModel.provider = args[0];
		await guildModel.save();
		
		const embed = new MessageEmbed()
			.setAuthor(client.user.username, client.user.displayAvatarURL())
			.setDescription(`Provider changed`);

		return message.channel.send(embed);
	}
};