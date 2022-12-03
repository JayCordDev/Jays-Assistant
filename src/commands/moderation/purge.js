const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { EMOJIS } = require("../../config")

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
        .setDescription('target who messages are to be purged')
        .setRequired(false)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { channel, options } = interaction;

        const Amount = options.getNumber('amount');
        const Target = options.getMember('target');

        const Messages = await channel.messages.fetch();
        
        const Response = new EmbedBuilder()
        .setColor("0x000000");

        if(Target){
            let i = 0;
            const filtered = [];
            (await Messages).filter((m) => {
                if(m.author.id === Target.id && Amount > i){
                    filtered.push(m);
                    i++;
                }
            })
            await channel.bulkDelete(filtered, true).then(messages => {
                Response.setDescription(`${EMOJIS.SUCCESS} Purged ${messages.size} ${messages.size > 1 ? "messages" : "message"} sent by ${Target}.`);
                interaction.reply({embeds:[Response]});
            });
        }
        else{
            await channel.bulkDelete(Amount, true).then(messages => { 
                Response.setDescription(`${EMOJIS.SUCCESS} Purged ${messages.size} ${messages.size > 1 ? "messages" : "message"}.`);
                interaction.reply({embeds:[Response]});
            })
        }
    },
};