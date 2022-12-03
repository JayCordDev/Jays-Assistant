const { EmbedBuilder, Events, channelMention } = require('discord.js');
const { EMBED_COLOURS } = require("../../config")

module.exports = (client) => {
    client.on(Events.GuildMemberAdd, (member) => {
        if (member.user.bot) return;

        const WelcomeChannel = member.guild.channels.cache.get('929378716902117471');

        const WelcomeEmbed = new EmbedBuilder()
        .setColor(EMBED_COLOURS.DEFAULT)
        .setTitle(`👋 Welcome to ${member.guild.name} ${member.user.tag}!`)
        .setThumbnail(`${member.user.displayAvatarURL()}`)
        .setDescription(`Welcome to the server, make sure to read ${channelMention('929387535434674207')} and go get some ${channelMention('929677586236313630')} enjoy your stay!\n\nYou are member **${member.guild.memberCount}**`)

        WelcomeChannel.send({ embeds: [WelcomeEmbed] });
    });
};