const { Client, ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    /**
     * @param {Client} client
     */
    async execute(client) {
        console.log('[Bot Status]: Online');
        client.user.setActivity( { name: 'JayCord', type: ActivityType.Watching } );
    },
};