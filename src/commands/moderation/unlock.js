const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { Error_Emoji } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock a channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option => option
            .setName('channel')
            .setDescription('Channel to unlock.')
            .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for unlocking the channel.')
            .setMaxLength(1000)
            .setMinLength(1)
    )
    .addStringOption(option => option
            .setName('flags')
            .setDescription('Unlock flags.')
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guildId, options, channel } = interaction;

        const UnlockChannel = options.getChannel('channel') || channel;
        const UnlockReason = options.getString('reason') || 'No reason provided.';
        const UnlockFlags = options.getString('flags');

        const UnlockedEmbed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Channel Unlocked')
        .setDescription('This channel has been unlocked.')
        .setFields({ name: 'Reason', value: `${UnlockReason}` })
        .setTimestamp()

        if (UnlockFlags) {
            return interaction.reply({ content: 'Flags are not released yet.', ephemeral: true });
        };

        if (!UnlockChannel.permissionsFor(guildId).has('SendMessages') === false) return interaction.reply({ content: 'Channel is already unlocked.', ephemeral: true });

        UnlockChannel.permissionOverwrites.edit(guildId, { SendMessages: null }).then(() => {
            interaction.reply({ content: 'Channel unlocked.', ephemeral: true });
            UnlockChannel.send({ embeds: [UnlockedEmbed] });
        });
    },
};