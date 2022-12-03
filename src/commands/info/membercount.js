const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Default_Embed_Colour } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('membercount')
		.setDescription('Gets the current number of members.'),
	/**
     * @param {ChatInputCommandInteraction} interaction
     */
	async execute(interaction) {
		const { guild } = interaction;

		const CountEmbed = new EmbedBuilder()
			.setColor(Default_Embed_Colour)
			.setAuthor({ name: `${guild.name}`, iconURL: `${guild.iconURL()}` })
			.setDescription(`**${guild.memberCount}**`);

		interaction.reply({ embeds: [CountEmbed] });
	},
};