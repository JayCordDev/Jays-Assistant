const { SlashCommandBuilder, PermissionFlagsBits, channelMention } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slowmode')
		.setDescription('Sets a channels slowmode.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
		.addUserOption(option => option
			.setName('duration')
			.setDescription('Slowmode duration.'),
		),
	/**
     * @param {ChatInputCommandInteraction} interaction
     */
	async execute(interaction) {
		const { channel, options } = interaction;

		const SlowmodeDuration = options.getString('duration');
		const CurrentSlowmode = channel.rateLimitPerUser;

		if (!SlowmodeDuration) return interaction.reply({ content: `Current slowmode for ${channelMention(channel.id)} \`${CurrentSlowmode}\`` });

		if (SlowmodeDuration === 0) {
			if (!channel.rateLimitPerUser) {
				return interaction.reply({ content: 'No slowmode set.' });
			}
			else {
				channel.setRateLimitPerUser(0);
				interaction.reply({ content: 'Slowmode disabled.' });
			}
		}
		else {
			channel.setRateLimitPerUser(SlowmodeDuration);
			interaction.reply({ content: `Slowmode has been set to \`${SlowmodeDuration}\`` });
		}
	},
};