const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { EMOJIS } = require('../../config');
const randomstring = require('randomstring');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unbans a user from the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(option => option
            .setName('target')
            .setDescription('User to unban (ID).')
            .setRequired(true)
            .setMaxLength(1000)
            .setMinLength(1)
    )
    .addStringOption(option => option
            .setName('reason')
            .setDescription('The unban reason.')
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, options, user } = interaction;

        const TargetID = options.getString('target');
        const UnbanReason = options.getString('reason') || 'No reason provided.';

        const LogChannel = guild.channels.cache.get('946156432057860103');
        const CaseId = randomstring.generate({ length: 18, charset: 'numeric' });

        await guild.bans.fetch().then(async (bans) => {
            if (bans.size === 0) return interaction.reply({ content: 'No bans.', ephemeral: true });
            const InvalidIDEmbed = new EmbedBuilder('Red').setDescription(`${EMOJIS.ERROR} | No ban found with ID \`${TargetID}\``)

            let bannedId = bans.find((ban) => ban.user.id === TargetID);
            if (!bannedId) return interaction.reply({ embeds: [InvalidIDEmbed] });

            await guild.bans.remove(TargetID, UnbanReason).then(() => {
                const UnbannedEmbed = new EmbedBuilder().setColor('Green').setDescription(`${EMOJIS.SUCCESS} | <@${TargetID.id}> has been unbanned | \`${CaseId}\``)
                interaction.reply({ embeds: [UnbannedEmbed] });
                
                const LogEmbed = new EmbedBuilder()
                .setColor('Green')
                .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
                .setDescription(`**Member**: <@${TargetID.id}> | \`${TargetID.id}\`\n**Type**: Unban\n**Reason**: ${UnbanReason}`)
                .setFooter({ text: `Punishment ID: ${CaseId}` })
                .setTimestamp();
        
                LogChannel.send({ embeds: [LogEmbed] });
            });
        });
    },
};