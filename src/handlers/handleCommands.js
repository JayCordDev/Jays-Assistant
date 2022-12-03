const { REST, Routes } = require('discord.js');
const { readdirSync } = require('fs');
require('dotenv/config');

module.exports = (client) => {
	client.handleCommands = async () => {
		client.commandsArray = [];

		const commandFolders = readdirSync('./src/commands');
		for (const folder of commandFolders) {
			const commandFiles = readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
			for (const file of commandFiles) {
				const command = require(`../commands/${folder}/${file}`);
				client.commands.set(command.data.name, command);
				client.commandsArray.push(command.data.toJSON());
			}
		}

		const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

		try {
			await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: client.commandsArray });
			console.log('[Commands]: Loaded');
		}
		catch (error) {
			console.log(error);
		}
	};
};