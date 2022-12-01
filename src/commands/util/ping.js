import { ChatInputCommandInteraction, SlashCommandBuilder, Client } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Returns with the bots ping.'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { createdTimestamp } = interaction;

        const sentMessage = await interaction.reply({ content: 'Pinging..', fetchReply: true });
        const latency = sentMessage.createdTimestamp - createdTimestamp;

        interaction.editReply({ content: `Latency: **${latency}ms** - API: **${Math.round(client.ws.ping)}ms**`});
    },
};
