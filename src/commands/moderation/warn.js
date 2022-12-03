const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { EMOJIS } = require('../../config');
const database = require('../../database/schemas/PunishmentSchema.js');
const randomstring = require('randomstring');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warns a user.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to warn.')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('reason')
            .setDescription('The warn reason.')
            .setMaxLength(1000)
            .setMinLength(1)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, guildId, options, user, createdTimestamp } = interaction;

        const TargetUser = options.getUser('target');
        const WarnReason = options.getString('reason') || 'No reason provided.';

        const WarnDate = new Date(createdTimestamp).toDateString();
        const LogChannel = guild.channels.cache.get('946156432057860103');
        const CaseId = randomstring.generate({ length: 18, charset: 'numeric' });      
        
        const CannotWarnSelfEmbed = new EmbedBuilder().setColor('Red').setDescription(`${EMOJIS.ERROR} | You cannot warn yourself.`)
        if (TargetUser.id === user.id) return interaction.reply({ embeds: [CannotWarnSelfEmbed] });

        const DirectEmbed = new EmbedBuilder()
        .setColor(DirectMessage_Embed_Colour)
        .setAuthor({ name: `${guild.name}`, iconURL: `${guild.iconURL()}` })
        .setTitle(`You have been warned in ${guild.name}`)
        .setFields(
            {
                name: 'Reason',
                value: `${WarnReason}`
            }
        )
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp();

        await TargetUser.send({ embeds: [DirectEmbed] }).catch((console.error));

        database.findOne({ Type: 'Warn', CaseID: CaseId, GuildID: guildId, UserID: TargetUser.id, UserTag: TargetUser.tag }, async (err, res) => {
            if (err) throw err;
            if (!res) {
                data = new database({
                    Type: 'Warn',
                    CaseID: CaseId,
                    GuildID: guildId,
                    UserID: TargetUser.id,
                    UserTag: TargetUser.tag,
                    Content: [
                        {
                            Moderator: user.tag,
                            WarnDate: WarnDate,
                            Reason: WarnReason   
                        }
                    ],
                });
            } else {
                const obj = {
                    Moderator: user.tag,
                    WarnDate: WarnDate,
                    Reason: WarnReason
                };
                data.Content.push(obj);
            };
            data.save();
        });

        const WarnSuccessEmbed = new EmbedBuilder().setColor('Green').setDescription(`${EMOJIS.SUCCESS} | <@${TargetUser.id}> has been warned | \`${CaseId}\``)
        interaction.reply({ embeds: [WarnSuccessEmbed] });

        const LogEmbed = new MessageEmbed()
        .setColor('Orange')
        .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription(`**Member**: <@${TargetUser.id}> | \`${TargetUser.id}\`\n**Type**: Warn\n**Reason**: ${WarnReason}`)
        .setFooter({ text: `Case: ${CaseId}` })
        .setTimestamp()

        LogChannel.send({ embeds: [LogEmbed] });
    },
};
