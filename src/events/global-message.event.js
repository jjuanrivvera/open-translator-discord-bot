const config = require('../config');

const { Collection } = require('discord.js');
const { Guild } = require('../models');

module.exports = {
	name: 'message',
    allowedGlobalCommands: [
        "help",
        "prefix"
    ],
	async execute(message, client) {
		if (message.author.bot || !message.content.startsWith(`${config.PREFIX}`)) return;

        let guildModel = await Guild.findOne({
			id: message.guild.id
		});

		if (!guildModel) {
			guildModel = await Guild.create({
				id: message.guild.id,
				name: message.guild.name,
				prefix: config.PREFIX,
				provider: "google",
				autoTranslate: false
			});
		};

		const args = message.content.slice(config.PREFIX.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();

        if (!this.allowedGlobalCommands.includes(command)) return;

		const { cooldowns } = client;

		const discordCommand = client.commands.get(command);

		if (!cooldowns.has(discordCommand.name)) {
            cooldowns.set(discordCommand.name, new Collection());
        }

		const now = Date.now();
        const timestamps = cooldowns.get(discordCommand.name);
        const cooldownAmount = (discordCommand.cooldown || 5) * 1000;
		
		if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.channel.send(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${discordCommand.name}\` command.`).then(msg => msg.delete({ timeout: 3000 }))
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		if (discordCommand.requireArgs > args.length) {
            let reply = `You didn't provide all the arguments!`;
        
            if (discordCommand.usage) {
                reply += `\nThe proper usage would be: \`${guildModel.prefix}${discordCommand.usage}\``;
            }

            if (discordCommand.example) {
                reply += `\nExample: \`${guildModel.prefix}${discordCommand.example}\``;
            }
        
            return message.channel.send(reply);
        }

		try {
			discordCommand.execute(message, args, client, guildModel);
		} catch (error) {
			console.error(error);
			return message.channel.send('There was an error trying to execute that command!').then(message => message.delete({ timeout: 3000 }));
		}
	}
};