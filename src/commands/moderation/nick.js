const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { Error_Emoji } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nick')
		.setDescription('Change or reset a members nickname.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
		.addUserOption(option => option
			.setName('target')
			.setDescription('User to change.')
			.setRequired(true),
		)
		.addStringOption(option => option
			.setName('nickname')
			.setDescription('New nickname.')
			.setMaxLength(32)
			.setMinLength(1),
		),
	/**
     * @param {ChatInputCommandInteraction} interaction
     */
	async execute(interaction) {
		const { guild, options } = interaction;

		const TargetUser = options.getUser('target');
		const TargetMember = await guild.members.fetch(TargetUser.id);
		const Nickname = options.getString('nickname');

		const CannotChangeEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Error_Emoji} | Unable to moderate this user.`);
		if (!TargetMember.moderatable) return interaction.reply({ embeds: [CannotChangeEmbed] });

		if (!Nickname) {
			if (!TargetMember.nickname) {
				return interaction.reply({ content: 'User has no nickname set.' });
			}
			else {
				await TargetMember.setNickname('');
				return interaction.reply({ content: 'Nickname reset.' });
			}
		}
		else {
			await TargetMember.setNickname(Nickname);
			return interaction.reply({ content: `Nickname has been set to **${Nickname}**` });
		}
	},
};