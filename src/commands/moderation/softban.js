const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { DirectMessage_Embed_Colour, Success_Emoji, Error_Emoji } = require('../../config.json');
const randomstring = require('randomstring');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('softban')
    .setDescription('Ban a user and then instantly unban.')
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

        const CannotBanEmbed = new EmbedBuilder().setColor("Red").setDescription(`${Error_Emoji} | Unable to softban this user.`)
        if (!TargetMember.bannable) return interaction.reply({ embeds: [CannotBanEmbed] });

        const BanSuccessEmbed = new EmbedBuilder().setColor('Green').setDescription(`${Success_Emoji} | <@${TargetUser.id}> has been softbanned | \`${CaseId}\``)
        interaction.reply({ embeds: [BanSuccessEmbed] });

        await TargetMember.ban({ deleteMessageSeconds: 86400, reason: BanReason }).then(async () => {
            await guild.bans.fetch().then(async (bans) => {
                bans.find((ban) => ban.user.id === TargetUser);
                await guild.bans.remove(TargetUser);
            });
        });

        const LogEmbed = new EmbedBuilder()
        .setColor('Orange')
        .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription(`**Member**: <@${TargetUser.id}> | \`${TargetUser.id}\`\n**Type**: Softban\n**Reason**: ${BanReason}`)
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp()
        
        LogChannel.send({ embeds: [LogEmbed] });
    },
};
