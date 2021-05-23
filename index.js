const bot = require('./src/bot');
const db = require('./src/config/db');

db.init();
bot.loadCommands();
bot.loadEvents();
bot.login();