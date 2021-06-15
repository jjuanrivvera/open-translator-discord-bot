const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Display help menu',
	usage: "help [command]",
	accessibility: "everyone",
	clientPermissions: [
		"SEND_MESSAGES",
		"EMBED_LINKS"
	],
	async execute(message, args, client, guildModel) {
		const { commands } = message.client;
		
		if (!args.length) {
			const helpEmbed = new MessageEmbed()
				.setAuthor(client.user.username, client.user.displayAvatarURL())
				.setDescription(`Type \`${guildModel.prefix}help [command]\` for more help eg. \`${guildModel.prefix}help languages\``);

			const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

			for (const file of commandFiles) {
				const command = require(`./${file}`);

				const field = {
					name: command.name,
					value: command.description
				};

				helpEmbed.addFields(field);
			}

			return await message.channel.send(helpEmbed);
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.channel.send('That\'s not a valid command!').then(message => message.delete({ timeout: 3000 }));
		}

		const helpEmbed = new MessageEmbed()
				.setColor('#0099ff')
				.setAuthor(client.user.username, client.user.displayAvatarURL())
				.setTitle(`Help for ${command.name} command`)
				.addFields(
					{
						name: "Description",
						value: command.description || "This command has no description"
					}
				);

		if (command.aliases) helpEmbed.addField(`**Aliases:**`, `${command.aliases.join(', ')}`);
		if (command.usage) helpEmbed.addField(`**Usage:**`, `${guildModel.prefix}${command.usage}`);
		if (command.requireArgs) helpEmbed.addField(`**Required Args:**`, `${command.requireArgs}`);
		if (command.example) helpEmbed.addField(`**Example:**`, `${guildModel.prefix}${command.example}`);
		if (command.accessibility) helpEmbed.addField(`**Accessibility:**`, `${command.accessibility}`);
		
		helpEmbed.addField(`**Cooldown:**`, `${command.cooldown || 5} second(s)`);

		await message.channel.send(helpEmbed);
	}
};