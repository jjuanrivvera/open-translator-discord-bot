const config = require('../config');
const sentry = require('../config/sentry');

const {
	Collection
} = require('discord.js');
const {
	Guild
} = require('../models');
const {
	Logger
} = require('../util');

module.exports = {
	name: 'message',
	allowedGlobalCommands: [
        "help",
        "prefix"
    ],
	async execute(message, client) {
		if (message.author.bot || !message.guild) return;

		const guildModel = await this.getGuildModel(message.guild);

		let prefix = null;
		let command = null;
		let args = null;

		if (message.content.startsWith(guildModel.prefix)) {
			prefix = guildModel.prefix
			
			args = message.content.slice(prefix.length).trim().split(/ +/);
			command = args.shift().toLowerCase();
		} else if (message.content.startsWith(config.PREFIX)) {
			prefix = config.PREFIX;

			args = message.content.slice(prefix.length).trim().split(/ +/);
			command = args.shift().toLowerCase();

			if (!this.allowedGlobalCommands.includes(command)) return;
		} else {
			return;
		};

		const { member, channel, guild} = message;

		Logger.log('info',`${message.author.tag} in ${guild.name} #${channel.name} sent: ${message.content}`);

		const {
			cooldowns
		} = client;

		const discordCommand = client.commands.get(command) ||
			client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command)) ||
			client.commands.get('translate');

		if (discordCommand.requireArgs > args.length) {
			let reply = `You didn't provide all the arguments!`;

			if (discordCommand.usage) {
				reply += `\nThe proper usage would be: \`${prefix}${discordCommand.usage}\``;
			}

			if (discordCommand.example) {
				reply += `\nExample: \`${prefix}${discordCommand.example}\``;
			}

			return message.channel.send(reply);
		}

		const commandHasCooldown = this.commandHasCooldown(discordCommand, cooldowns, message);

		if (commandHasCooldown) {
			const {
				timeLeft
			} = commandHasCooldown;

			return message.channel.send(
				`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${discordCommand.name}\` command.`
			).then(msg => msg.delete({
				timeout: 3000
			}));
		}

		if (!this.clientHasPermissions(discordCommand, guild, channel)) {
			Logger.log(
				'warn',
				`The bot does not have the right permissions to execute ${discordCommand.name} on ${guild.name} - #${channel.name}`
			);
			return;
		}

		if (!this.userHasAccess(discordCommand, member, guild)) {
			Logger.log('warn',`The user ${member.user.tag} does not have the right permissions to execute "${discordCommand.name}"`);
			return;
		}

		try {
			discordCommand.execute(message, args, client, guildModel);
		} catch (error) {
			Logger.log('error', error);
			sentry.captureException(error);
			return message.channel.send('There was an error trying to execute that command!').then(message => message.delete({
				timeout: 3000
			}));
		}
	},
	clientHasPermissions(command, guild, channel) {
		const botPermissionsIn = guild.me.permissionsIn(channel).toArray();

		for (const permission of command.clientPermissions) {
			if (!botPermissionsIn.includes(permission)) return false;
		}

		return true;
	},
	userHasAccess(command, member, guild) {
        let result = true;

        if (command.accessibility === "admin" && !member.hasPermission("ADMINISTRATOR")) {
            result = false;
        } else if (command.accessibility === "owner" && guild.owner.id !== member.user.id) {
            result = false;
        }

        return result;
    },
	commandHasCooldown(command, cooldowns, message) {
		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 6) * 1000;

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return {
					timeLeft
				};
			} else {
				return false;
			}
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	},
	async getGuildModel(guild) {
		let guildModel = await Guild.findOne({
			id: guild.id
		});

		if (!guildModel) {
			guildModel = await Guild.create({
				id: guild.id,
				name: guild.name,
				prefix: config.PREFIX,
				provider: "google",
				autoTranslate: false
			});
		};

		return guildModel;
	}
};