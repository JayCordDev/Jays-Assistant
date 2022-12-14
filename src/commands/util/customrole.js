const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('custom-role')
    .setDescription('Creates a custom role.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption(option => option
            .setName('user')
            .setDescription('User to give the role to.')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('name')
            .setDescription('Name of the role.')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('colour')
            .setDescription('Role colour.')
            .setRequired(true)
    )
    .addAttachmentOption(option => option
            .setName('icon')
            .setDescription('Role icon.')
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, options } = interaction;

        const TargetUser = options.getUser('user');
        const TargetMember = await guild.members.fetch(TargetUser.id);

        const RoleName = options.getString('name');
        const RoleColour = options.getString('colour');
        const RoleIcon = options.getAttachment('icon');

        const Divider = await guild.roles.fetch('1052436531551412244');

        if (!RoleColour.includes('#')) return interaction.reply({ content: 'Provide a valid hex colour.', ephemeral: true });
        if (!TargetMember.manageable) return interaction.reply({ content: 'Unable to give role.', ephemeral: true });

        const CustomRole = await guild.roles.create({
            name: RoleName,
            color: RoleColour,
            icon: RoleIcon,
            mentionable: false,
            position: Divider.position - 1
        });

        TargetMember.roles.add(CustomRole);
        return interaction.reply({ content: `Role created and given to ${TargetUser.tag}`, ephemeral: true });
    },
};