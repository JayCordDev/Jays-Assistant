const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, userMention, inlineCode, channelMention } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot say something.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option => option
            .setName('message')
            .setDescription('What do you want the bot to say?')
            .setRequired(true)
            .setMaxLength(2000)
            .setMinLength(1)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, channel, options, user } = interaction;

        const Message = options.getString('message');

        const LogChannel = guild.channels.cache.get('946156222292299807');

        channel.send({ content: `${Message}`, allowedMentions: { parse: ['users'] } }).then(() => {
            interaction.reply({ content: 'Message sent.', ephemeral: true });
        });

        const LogEmbed = new EmbedBuilder()
        .setTitle('Say Command Used')
        .setColor('DarkGrey')
        .setFields(
            {
                name: '• User',
                value: `${userMention(user.id)} | ${inlineCode(user.id)}`
            },
            {
                name: '• Channel',
                value: `${channelMention(channel.id)} | ${inlineCode(channel.id)}`
            },  
            {
                name: '• Content',
                value: Message
            }
        )
        .setTimestamp()

        LogChannel.send({ embeds: [LogEmbed] });
    },
};