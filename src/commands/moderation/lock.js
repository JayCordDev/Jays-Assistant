const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { Error_Emoji } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock a channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option => option
            .setName('channel')
            .setDescription('Channel to lock.')
            .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for locking the channel.')
            .setMaxLength(1000)
            .setMinLength(1)
    )
    .addStringOption(option => option
            .setName('flags')
            .setDescription('Lock flags.')
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guildId, options, channel } = interaction;

        const LockChannel = options.getChannel('channel') || channel;
        const LockReason = options.getString('reason') || 'No reason provided.';
        const LockFlags = options.getString('flags');

        const LockedEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('Channel Locked')
        .setDescription('This channel has been locked, you are not muted!')
        .setFields({ name: 'Reason', value: `${LockReason}` })
        .setTimestamp()

        if (LockFlags) {
            return interaction.reply({ content: 'Flags are not released yet.', ephemeral: true });
        };

        if (LockChannel.permissionsFor(guildId).has('SendMessages') === false) return interaction.reply({ content: 'Channel is already locked.', ephemeral: true });

        LockChannel.permissionOverwrites.edit(guildId, { SendMessages: false }).then(() => {
            interaction.reply({ content: 'Channel locked.', ephemeral: true });
            LockChannel.send({ embeds: [LockedEmbed] });
        });
    },
};