const { EmbedBuilder, Events, channelMention, roleMention, userMention } = require('discord.js');
const { Default_Embed_Colour } = require('../../config.json');

module.exports = (client) => {
    client.on(Events.GuildMemberAdd, (member) => {
        if (member.user.bot) return;

        const WelcomeChannel = member.guild.channels.cache.get('929378716902117471');

        const WelcomeEmbed = new EmbedBuilder()
        .setColor(Default_Embed_Colour)
        .setTitle(`👋 Welcome to ${member.guild.name} ${member.user.tag}!`)
        .setThumbnail(`${member.user.displayAvatarURL()}`)
        .setDescription(`Welcome to the server, make sure to read ${channelMention('929387535434674207')} and go get some ${channelMention('929677586236313630')} enjoy your stay!\n\nYou are member **${member.guild.memberCount}**`)

        WelcomeChannel.send({ content: `${userMention(member.user.id)} | ${roleMention('959451229501677649')}`, embeds: [WelcomeEmbed] });
    });
};