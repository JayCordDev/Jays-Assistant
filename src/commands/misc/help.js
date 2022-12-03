const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Brings up the help menu.'),
	/**
     * @param {ChatInputCommandInteraction} interaction
     */
	async execute(interaction) {
		const { user } = interaction;

		const embed = new EmbedBuilder()
			.setTitle('Hey!')
			.setDescription('You can use `/` to bring up all the commands.\nUse the Drop Down Menu given below to navigate through the help menu.')
			.setColor('Aqua')
			.setTimestamp()
			.setFooter({ text: `Requested by ${user.tag}` });

		const embed2 = new EmbedBuilder()
			.setTitle('Miscellaneous Commands')
			.setDescription(
				'**/avatar:** Gets a user\'s avatar.\n' +
            '**/help:** Brings up the help menu!\n',
			)
			.setColor('Yellow')
			.setFooter({ text: `Requested by ${user.tag}` })
			.setTimestamp();
		const embed3 = new EmbedBuilder()
			.setTitle('Info Commands')
			.setDescription(
				'**/membercount:** Gets the current number of members.\n' +
            '**/userinfo (user):** Gets information on a user.\n' +
            '**/serverinfo:** Gets information on the server.\n',
			)
			.setColor('Red')
			.setFooter({ text: `Requested by ${user.tag}` })
			.setTimestamp();

		const embed4 = new EmbedBuilder()
			.setTitle('Utility Commands')
			.setDescription(
				'**/debug:** Returns bot statistics.\n' +
            '**/ping:** Returns the bot\'s ping.',
			)
			.setColor('DarkOrange')
			.setFooter({ text: `Requested by ${user.tag}` })
			.setTimestamp();

		const embed5 = new EmbedBuilder()
			.setTitle('Moderation Commands')
			.setDescription(
				'**/ban (target) (reason) (force):** Bans a user from the server.\n' +
            '**/unban (target) (reason):** Unbans a user from the server..\n' +
            '**/kick (target) (reason):** Kicks a user from the server.\n' +
            '**/mute (target) (duration) (reason):** Mutes a user.\n' +
            '**/warn (target) (reason):** Warns a user.\n' +
            '**/mod (user):** Moderates a user\'s server nickname.\n' +
            '**/nick (target) (nickname):** Changes or resets a member\'s nickname.\n' +
            '**/clear (amount):** Clears messages from a channel.\n' +
            '**/slowmode (time) (reason):** Sets channel slowmode to the specified time.',
			)
			.setColor('Orange')
			.setFooter({ text: `Requested by ${user.tag}` })
			.setTimestamp();

		const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('sel')
					.setPlaceholder('Choose a Category')
					.addOptions([
						{
							label: 'Main Menu',
							value: 'e',
							emoji: '🏡',
						},
						{
							label: 'Info Commands',
							value: 'b',
							emoji: '❓',
						},
						{
							label: 'Moderation Commands',
							value: 'd',
							emoji: '🔨',
						},
						{
							label: 'Misc Commands',
							value: 'a',
							emoji: '✨',
						},
						{
							label: 'Utility Commands',
							value: 'c',
							emoji: '🔧',
						},
					]),
			);
		try {
			const msg = await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
			const collector = msg.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 15000 });
			// eslint-disable-next-line no-shadow
			collector.on('collect', interaction => {
				if (interaction.customId === 'sel') {
					if (interaction.values[0] === 'a') {
						interaction.update({ embeds: [embed2], ephemeral: true });
					}
					else if (interaction.values[0] === 'b') {
						interaction.update({ embeds: [embed3], ephemeral: true });
					}
					else if (interaction.values[0] === 'c') {
						interaction.update({ embeds: [embed4], ephemeral: true });
					}
					else if (interaction.values[0] === 'd') {
						interaction.update({ embeds: [embed5], ephemeral: true });
					}
					else if (interaction.values[0] === 'e') {
						interaction.update({ embeds: [embed], ephemeral: true });
					}
				}
			});

		}
		catch (error) {
			console.log(error);
		}
	},
};
