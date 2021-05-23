const { Guild } = require('../models');

module.exports = {
	name: 'guildMemberAdd',
	async execute(member) {
        const { id, guild } = member;

        console.log(member);
	}
};