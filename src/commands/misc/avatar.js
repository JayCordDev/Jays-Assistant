const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription(`Gets a user's avatar.`)
    .addUserOption(option => option
            .setName('target')
            .setDescription('The user whose avatar you want to fetch.')
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options, user } = interaction;

        const Target = options.getUser('target') || user;

        const AvatarEmbed = new EmbedBuilder()
        .setAuthor({ name: `${Target.tag}'s Avatar`, iconURL: `${Target.displayAvatarURL()}` })
        .setImage(`${Target.displayAvatarURL({ size: 512, extension: 'png' })}`)

        interaction.reply({ embeds: [AvatarEmbed] });
    },
};