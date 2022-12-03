const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { DirectMessage_Embed_Colour, Success_Emoji, Error_Emoji } = require('../../config.json');
const randomstring = require('randomstring');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick a user from the server.')
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.addUserOption(option => option
			.setName('target')
			.setDescription('User to kick.')
			.setRequired(true),
		)
		.addStringOption(option => option
			.setName('reason')
			.setDescription('The kick reason.')
			.setMaxLength(1000)
			.setMinLength(1),
		),
	/**
     * @param {ChatInputCommandInteraction} interaction
     */
	async execute(interaction) {
		const { guild, options, user } = interaction;

		const TargetUser = options.getUser('target') || user;
		const TargetMember = await guild.members.fetch(TargetUser.id);
		const KickReason = options.getString('reason') || 'No reason provided.';

		const LogChannel = guild.channels.cache.get('946156432057860103');
		const CaseId = randomstring.generate({ length: 18, charset: 'numeric' });

		const CannotKickEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Error_Emoji} | Unable to kick this user.`);
		if (!TargetMember.kickable) return interaction.reply({ embeds: [CannotKickEmbed] });

		const DirectEmbed = new EmbedBuilder()
			.setColor(DirectMessage_Embed_Colour)
			.setAuthor({ name: `${guild.name}`, iconURL: `${guild.iconURL()}` })
			.setTitle(`You have been kicked from ${guild.name}`)
			.setFields(
				{
					name: 'Reason',
					value: `${KickReason}`,
				},
			)
			.setFooter({ text: `Punishment ID: ${CaseId}` })
			.setTimestamp();

		await TargetUser.send({ embeds: [DirectEmbed] }).catch((console.error));

		await TargetMember.kick(KickReason).then(() => {
			const KickSuccessEmbed = new EmbedBuilder().setColor('Green').setDescription(`${Success_Emoji} | <@${TargetUser.id}> has been kicked | \`${CaseId}\``);
			interaction.reply({ embeds: [KickSuccessEmbed] });
		});

		const LogEmbed = new EmbedBuilder()
			.setColor('Red')
			.setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
			.setDescription(`**Member**: <@${TargetUser.id}> | \`${TargetUser.id}\`\n**Type**: Kick\n**Reason**: ${KickReason}`)
			.setFooter({ text: `Punishment ID: ${CaseId}` })
			.setTimestamp();

		LogChannel.send({ embeds: [LogEmbed] });
	},
};