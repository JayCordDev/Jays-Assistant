const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Default_Embed_Colour } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Gets a users avatar.')
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to get the avatar from.')
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options, user } = interaction;

        const Target = options.getUser('target') || user;

        const AvatarEmbed = new EmbedBuilder()
        .setColor(Default_Embed_Colour)
        .setAuthor({ name: `${Target.tag}'s Avatar`, iconURL: `${Target.displayAvatarURL()}` })
        .setImage(`${Target.displayAvatarURL({ size: 512, extension: 'png' })}`)

        interaction.reply({ embeds: [AvatarEmbed] });
    },
};