const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const randomstring = require('randomstring');
const { EMOJIS } = require('../../config')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to ban.')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('reason')
            .setDescription('The ban reason.')
            .setMaxLength(1000)
            .setMinLength(1)
    )
    .addBooleanOption(option => option
            .setName('force')
            .setDescription('Force this ban (Only if this user is not in the server).')
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, options, user } = interaction;

        const TargetUser = options.getUser('target') || user;
        const TargetMember = await guild.members.fetch(TargetUser.id);
        const BanReason = options.getString('reason') || 'No reason provided.';

        const LogChannel = guild.channels.cache.get('946156432057860103');
        const CaseId = randomstring.generate({ length: 18, charset: 'numeric' });

        const CannotBanEmbed = new EmbedBuilder().setColor("Red").setDescription(`${EMOJIS.ERROR} | Unable to ban this user.`)
        if (!TargetMember.bannable) return interaction.reply({ embeds: [CannotBanEmbed] });

        const DirectEmbed = new EmbedBuilder()
        .setAuthor({ name: `${guild.name}`, iconURL: `${guild.iconURL()}` })
        .setTitle(`You have been banned from ${guild.name}`)
        .setFields(
            {
                name: 'Reason',
                value: `${BanReason}`
            },
            {
                name: 'Appeal',
                value: 'https://forms.gle/2oweFFCMoDnY1Y8DA'
            }
        )
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp();

        await TargetUser.send({ embeds: [DirectEmbed] }).catch((console.error));

        await TargetMember.ban({ deleteMessageSeconds: 86400, reason: BanReason }).then(() => {
            const BanSuccessEmbed = new EmbedBuilder().setColor('Green').setDescription(`${EMOJIS.SUCCESS} | <@${TargetUser.id}> has been banned | \`${CaseId}\``)
            interaction.reply({ embeds: [BanSuccessEmbed] });
        });

        const LogEmbed = new EmbedBuilder()
        .setColor('Red')
        .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription(`**Member**: <@${TargetUser.id}> | \`${TargetUser.id}\`\n**Type**: Ban\n**Reason**: ${BanReason}`)
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp();

        LogChannel.send({ embeds: [LogEmbed] });
    },
};