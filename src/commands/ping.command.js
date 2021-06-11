module.exports = {
	name: 'ping',
	description: 'Get response speed',
	execute(message) {
		message.channel.send(`Pong | 🏓 ${Date.now() - message.createdTimestamp}ms.`);
	}
};