const { INVITE_LINK } = require('../config');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'invite',
	description: 'Invite me to your discord server',
	accessibility: "everyone",
	clientPermissions: [
		"SEND_MESSAGES",
		"EMBED_LINKS"
	],
	execute(message) {
		const embed = new MessageEmbed()
			.setTitle("Invite Me")
			.setDescription(`Add me to your discord server [here](${INVITE_LINK})`);

		return message.channel.send(embed);
	}
};