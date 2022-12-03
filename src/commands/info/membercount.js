const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('membercount')
    .setDescription('Gets the current number of members.'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild } = interaction;

        const CountEmbed = new EmbedBuilder()
        .setAuthor({ name: `${guild.name}`, iconURL: `${guild.iconURL()}` })
        .setDescription(`**${guild.memberCount}**`)

        interaction.reply({ embeds: [CountEmbed] });
    },
};