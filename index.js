const bot = require('./src/bot');

bot.loadCommands();
bot.loadEvents();
bot.login();