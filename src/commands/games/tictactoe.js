const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const { Game } = require('./builder')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('tictactoe')
    .setDescription('Starts a new tictactoe game.')
    .addUserOption(option => option
        .setName('user')
        .setDescription('The user to play with.')
        .setRequired(true)
    ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options, user } = interaction;

        const Target = options.getUser('user')

        if (Target.bot) return interaction.reply({ content: 'Cannot play against bots.', ephemeral: true });

        const game = new Game(Target, user, interaction);
        await game.run();
    },
};