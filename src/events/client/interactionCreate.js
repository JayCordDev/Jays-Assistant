module.exports = {
	name: 'interactionCreate',
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
	async execute(interaction, client) {
		if (!interaction.isCommand()) return;

		const cmd = client.commands.get(interaction.commandName);
		if (!cmd) return interaction.reply({ content: 'Requested command not found.', ephemeral: true });

		try {
			await cmd.execute(interaction, client);
		}
		catch (error) {
			interaction.reply({ content: 'An error occured whilst trying to run this command.', ephemeral: true });
			console.log(error);
		}
	},
};