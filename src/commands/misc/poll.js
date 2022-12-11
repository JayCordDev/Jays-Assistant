const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { Default_Embed_Colour, Success_Emoji, Error_Emoji } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a poll.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(option => option
            .setName('question')
            .setDescription('Poll question.')
            .setRequired(true)
            .setMaxLength(500)
            .setMinLength(1)
    )
    .addStringOption(option => option
            .setName('option1')
            .setDescription('Option 1.')
            .setRequired(true)
            .setMaxLength(500)
            .setMinLength(1)
    )
    .addStringOption(option => option
            .setName('option2')
            .setDescription('Option 2.')
            .setRequired(true)
            .setMaxLength(500)
            .setMinLength(1)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options, user } = interaction;

        const pollQuestion = options.getString('question');
        const option1 = options.getString('option1');
        const option2 = options.getString('option2');

        const PollEmbed = new EmbedBuilder()
        .setColor(Default_Embed_Colour)
        .setTitle(`${pollQuestion}`)
        .setFields(
            {
                name: 'Option 1',
                value: `> ${option1}`
            },
            {
                name: 'Option 2',
                value: `> ${option2}`
            }
        )
        .setFooter({ text: `Poll by: ${user.username}` })
        .setTimestamp()

        const message = await interaction.reply({ embeds: [PollEmbed], fetchReply: true });
        message.react(`${Success_Emoji}`);
        message.react(`${Error_Emoji}`);
    },
};