const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, inlineCode } = require('discord.js');
const { Default_Embed_Colour } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Brings up the help menu.'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const HelpEmbed = new EmbedBuilder()
        .setColor(Default_Embed_Colour)
        .setTitle('Help')
        .setDescription(`${client.user.user} is a private moderation and utility bot for JayCord, currently managed and maintaned by the lovely development team!`)
        .setFields(
            {
                name: '• Info',
                value: inlineCode('help, membercount, serverinfo, userinfo')
            },
            {
                name: '• Moderation',
                value: inlineCode('ban, clear, kick, mod, mute, nick, slowmode, unban, warn')
            },
            {
                name: '• Misc',
                value: inlineCode('avatar, poll')
            },
            {
                name: '• Games',
                value: inlineCode('tictactoe')
            },
            {
                name: '• Util',
                value: inlineCode('debug, ping')
            }
        )

        interaction.reply({ embeds: [HelpEmbed] });
    },
};
