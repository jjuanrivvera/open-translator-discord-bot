const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'support',
	description: 'Support bot developer',
	accessibility: "everyone",
	clientPermissions: [
		"SEND_MESSAGES",
		"EMBED_LINKS"
	],
	execute(message) {
		const embed = new MessageEmbed()
			.setTitle("Support Developer")
			.setDescription(`You can support my creator [here](https://www.paypal.com/paypalme/jjuanrivvera)`);

		return message.channel.send(embed);
	}
};