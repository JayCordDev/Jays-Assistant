const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const { Game } = require('./builder')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('tictactoe')
    .setDescription('Starts a new tictactoe game.')
    .addUserOption(option => option
        .setName('user')
        .setDescription('The user to play with.')
    ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const game = new Game(options.getUser('user'), interaction.user, interaction);
        await game.run();
    },
};