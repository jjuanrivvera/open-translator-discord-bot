const fs = require('fs');

const config = require('./config');
const { TOKEN } = config;

const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = {
    async loadCommands() {
        client.commands = new Discord.Collection();

        const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            // set a new item in the Collection
            // with the key as the command name and the value as the exported module
            client.commands.set(command.name, command);
        }
    },

    async loadEvents() {
        const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(`./events/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    },

    async login() {
        client.login(TOKEN);
    }
}