const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { Success_Emoji } = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Purge messages from a channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addNumberOption(option => option
            .setName('amount')
            .setDescription('Amount to purge.')
            .setMaxValue(100)
            .setMinValue(1)
            .setRequired(true)
    )
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to purge.')
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { channel, options } = interaction;

        const Amount = options.getNumber('amount');
        const Target = options.getMember('target');

        const Messages = await channel.messages.fetch();

        const Response = new EmbedBuilder()
        .setColor('Green');

        if(Target){
            let i = 0;
            const filtered = [];
            Messages.filter((m) => {
                if(m.author.id === Target.id && Amount > i){
                    filtered.push(m);
                    i++;
                }
            })
            await channel.bulkDelete(filtered, true).then(messages => {
                Response.setDescription(`${Success_Emoji} Purged ${messages.size} ${messages.size > 1 ? "messages" : "message"} sent by ${Target}.`);
                interaction.reply({ embeds: [Response] });
            });
        }
        else{
            await channel.bulkDelete(Amount, true).then(messages => { 
                Response.setDescription(`${Success_Emoji} Purged ${messages.size} ${messages.size > 1 ? "messages" : "message"}.`);
                interaction.reply({ embeds:[Response] });
            })
        }
    },
};