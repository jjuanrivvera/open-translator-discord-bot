const bot = require('./src/bot');
const db = require('./src/config/db');
const sentry = require('./src/config/sentry');

sentry.start();
db.init();
bot.loadCommands();
bot.loadEvents();
bot.login();