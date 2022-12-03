const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { EMBED_COLOURS, EMOJIS} = require('../../config');
const randomstring = require('randomstring');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mutes a user.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to mute.')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('duration')
            .setDescription('The mute duration (1d, 10m, 6h).')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('reason')
            .setDescription('The mute reason.')
            .setMaxLength(1000)
            .setMinLength(1)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, options, user } = interaction;

        const TargetUser = options.getUser('target') || user;
        const TargetMember = await guild.members.fetch(TargetUser.id);
        const MuteDuration = options.getString('duration');
        const MuteReason = options.getString('reason') || 'No reason provided.';

        const LogChannel = guild.channels.cache.get('946156432057860103');
        const CaseId = randomstring.generate({ length: 18, charset: 'numeric' });

        const CannotMuteEmbed = new EmbedBuilder().setColor("Red").setDescription(`${EMOJIS.ERROR} | Unable to mute this user.`)
        if (!TargetMember.moderatable) return interaction.reply({ embeds: [CannotMuteEmbed] });

        const AlreadyMutedEmbed = new EmbedBuilder().setColor("Red").setDescription(`${EMOJIS.ERROR} | This user is already muted.`)
        if (TargetMember.isCommunicationDisabled === true) return interaction.reply({ embeds: [AlreadyMutedEmbed] });

        const NotValidEmbed = new EmbedBuilder().setColor("Red").setDescription(`${EMOJIS.ERROR} | Input provided is invalid (Duration / Limit Hit).`)
        if (!ms(MuteDuration) || ms(MuteDuration) > ms('28d')) return interaction.reply({ embeds: [NotValidEmbed] });

        const DirectEmbed = new EmbedBuilder()
        .setColor(EMBED_COLOURS.WARNING)
        .setAuthor({ name: `${guild.name}`, iconURL: `${guild.iconURL()}` })
        .setTitle(`You have been muted in ${guild.name}`)
        .setFields(
            {
                name: 'Reason',
                value: `${MuteReason}`
            }
        )
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp();

        await TargetUser.send({ embeds: [DirectEmbed] }).catch((console.error));

        await TargetMember.timeout(ms(MuteDuration)).then(() => {
            const MuteSuccessEmbed = new EmbedBuilder().setColor('Green').setDescription(`${EMOJIS.SUCCESS} | <@${TargetUser.id}> has been muted | \`${CaseId}\``)
            interaction.reply({ embeds: [MuteSuccessEmbed] });
        });

        const LogEmbed = new EmbedBuilder()
        .setColor('Yellow')
        .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription(`**Member**: <@${TargetUser.id}> | \`${TargetUser.id}\`\n**Type**: Mute\n**Expires**: <t:${parseInt(TargetMember.communicationDisabledUntilTimestamp / 1000)}:R>\n**Reason**: ${MuteReason}`)
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp();

        LogChannel.send({ embeds: [LogEmbed] });
    },
};