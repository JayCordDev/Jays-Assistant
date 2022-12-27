const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('freeban')
    .setDescription('Ban yourself from the server.. for some reason I guess.'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, user } = interaction;

        const TargetUser = user;
        const Member = await guild.members.fetch(TargetUser.id);

        const LogChannel = guild.channels.cache.get('946156432057860103');

        if (!Member.bannable) return interaction.reply({ content: 'sorry im not banning you.', ephemeral: true });
        await Member.ban({ reason: 'Self ban lol.' });

        const LogEmbed = new EmbedBuilder()
        .setColor('Random')
        .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription(`**Member**: <@${TargetUser.id}> | \`${TargetUser.id}\`\n**Type**: SelfBan`)
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp()

        LogChannel.send({ embeds: [LogEmbed] });
    },
};
