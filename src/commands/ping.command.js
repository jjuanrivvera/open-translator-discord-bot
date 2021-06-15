module.exports = {
	name: 'ping',
	description: 'Get response speed',
	accessibility: "everyone",
	clientPermissions: [
		"SEND_MESSAGES",
		"EMBED_LINKS"
	],
	execute(message) {
		message.channel.send(`Pong | 🏓 ${Date.now() - message.createdTimestamp}ms.`);
	}
};