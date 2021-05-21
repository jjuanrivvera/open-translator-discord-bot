const config = require('../config');
const {PREFIX} = config;

module.exports = {
	name: 'message',
	execute(message, client) {
		if (!message.content.startsWith(PREFIX) || message.author.bot) return;

		console.log(`${message.author.tag} in #${message.channel.name} sent: ${message.content}`);

		const args = message.content.slice(PREFIX.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();

		if (!client.commands.has(command)) {
			return client.commands.get('translate').execute(message, args);
		}

		try {
			client.commands.get(command).execute(message, args);
		} catch (error) {
			console.error(error);
			message.channel.send('There was an error trying to execute that command!').then(message => message.delete({ timeout: 3000 }));
		}
	},
};