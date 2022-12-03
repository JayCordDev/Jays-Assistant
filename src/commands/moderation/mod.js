const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { EMOJIS } = require('../../config');
const randomstring = require('randomstring');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('mod')
    .setDescription('Moderate a users name.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to moderate.')
            .setRequired(true)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, options } = interaction;

        const TargetUser = options.getUser('target') || user;
        const TargetMember = await guild.members.fetch(TargetUser.id);

        const CannotModerateEmbed = new EmbedBuilder().setColor('Red').setDescription(`${EMOJIS.ERROR} | Unable to moderate this user.`)
        if (!TargetMember.moderatable) return interaction.reply({ embeds: [CannotModerateEmbed] });

        const ModeratedNickname_ID = randomstring.generate({ length: 5, charset: 'alphanumeric' });
        await TargetMember.setNickname(`Moderated Nickname - ${ModeratedNickname_ID}`);

        interaction.reply({ content: 'Nickname has been moderated.' });
    },
};