const { SlashCommandBuilder, EmbedBuilder, codeBlock } = require('discord.js');
const { Default_Embed_Colour } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Gets information on the server.'),
	/**
     * @param {ChatInputCommandInteraction} interaction
     */
	async execute(interaction) {
		const { guild, guildId } = interaction;

		const ServerOwner = (await guild.fetchOwner()).user.tag;
		const ServerBanner = guild.bannerURL({ size: 2048 }) || null;
		const ServerFeatures = guild.features.join('\n') || 'None';

		const InfoEmbed = new EmbedBuilder()
			.setColor(Default_Embed_Colour)
			.setAuthor({ name: `${guild.name}`, iconURL: `${guild.iconURL()}` })
			.setThumbnail(`${guild.iconURL()}`)
			.setImage(ServerBanner)
			.setFields(
				{
					name: '• Description',
					value: codeBlock(guild.description),
				},
				{
					name: '• Creation',
					value: `<t:${parseInt(guild.createdTimestamp / 1000)}:R>`,
				},
				{
					name: '• Members',
					value: codeBlock(guild.memberCount),
				},
				{
					name: '• ID',
					value: codeBlock(guildId),
				},
				{
					name: '• Moderation',
					value: codeBlock(guild.verificationLevel),
					inline: true,
				},
				{
					name: '• Boost Level',
					value: codeBlock(guild.premiumTier),
					inline: true,
				},
				{
					name: '• Owner',
					value: codeBlock(ServerOwner),
				},
				{
					name: '• Roles',
					value: codeBlock(guild.roles.cache.size),
					inline: true,
				},
				{
					name: '• Emojis',
					value: codeBlock(guild.emojis.cache.size),
					inline: true,
				},
				{
					name: '• Channels',
					value: codeBlock(guild.channels.cache.size),
					inline: true,
				},
				{
					name: '• Features',
					value: codeBlock(ServerFeatures),
				},
			);

		interaction.reply({ embeds: [InfoEmbed] });
	},
};