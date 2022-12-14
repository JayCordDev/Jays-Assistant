const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ChannelType, inlineCode} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Creates a ticket.')
    .addStringOption(option => option
            .setName('type')
            .setDescription('The ticket type.')
            .addChoices(
                { name: '🛑 Support', value: 'support-ticket'},
                { name: '🔧 Report', value: 'report-ticket'}
            )
            .setRequired(true)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, guildId, options, user } = interaction;

        const ticketType = options.getString('type');
        const ticketCategory = '1038764233699115078';
        const staffRole = await guild.roles.fetch('929382693916008478');
        
        let chosenTicket = '';

        switch (ticketType) {
            case 'support-ticket':
                chosenTicket = 'Support'

                const SupportTicketEmbed = new EmbedBuilder()
                .setColor('Red')
                .setDescription('Whilst you are waiting for a staff member to respond, please explain your issue in as much detail as possible.')
                .setFooter({ text: `Type: ${chosenTicket}` })

                const ticketControlButtons = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('close-ticket').setLabel('Close').setStyle(ButtonStyle.Danger),
                )
                
                const ticketChannel = await guild.channels.create({
                    name: `${user.username}-support`,
                    topic: `${user.username} | ${inlineCode(user.id)} | Type: ${chosenTicket}`,
                    type: ChannelType.GuildText,
                    parent: ticketCategory,
                    permissionOverwrites: [
                        {
                            id: user.id,
                            allow: ['ViewChannel', 'ReadMessageHistory', 'SendMessages', 'EmbedLinks', 'AttachFiles']
                        },
                        {
                            id: guildId,
                            deny: ['ViewChannel']
                        },
                        {
                            id: staffRole.id,
                            allow: ['ViewChannel', 'ReadMessageHistory', 'SendMessages', 'EmbedLinks', 'AttachFiles', 'ManageMessages']
                        }
                    ]
                });

                ticketChannel.send({ embeds: [SupportTicketEmbed], components: [ticketControlButtons] });

                const collector = ticketChannel.createMessageComponentCollector({ componentType: ComponentType.Button });

                collector.on('collect', i => {
                    if (i.customId === 'close-ticket') {
                        if (!i.member.permissions.has('ManageMessages')) return;
                        ticketChannel.delete();
                    };
                });
                break;
            case 'report-ticket':
                chosenTicket = 'Report'

                const ReportTicketEmbed = new EmbedBuilder()
                .setColor('Red')
                .setDescription('Whilst you are waiting for a staff member to respond, please explain your issue in as much detail as possible.')
                .setFooter({ text: `Type: ${chosenTicket}` })

                const ticketControlButtons2 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('close-ticket').setLabel('Close').setStyle(ButtonStyle.Danger),
                )
                
                const ticketChannel2 = await guild.channels.create({
                    name: `${user.username}-report`,
                    topic: `${user.username} | ${inlineCode(user.id)} | Type: ${chosenTicket}`,
                    type: ChannelType.GuildText,
                    parent: ticketCategory,
                    permissionOverwrites: [
                        {
                            id: user.id,
                            allow: ['ViewChannel', 'ReadMessageHistory', 'SendMessages', 'EmbedLinks', 'AttachFiles']
                        },
                        {
                            id: guildId,
                            deny: ['ViewChannel']
                        },
                        {
                            id: staffRole.id,
                            allow: ['ViewChannel', 'ReadMessageHistory', 'SendMessages', 'EmbedLinks', 'AttachFiles', 'ManageMessages']
                        }
                    ]
                });

                ticketChannel.send({ embeds: [ReportTicketEmbed], components: [ticketControlButtons2] });

                const collector2 = ticketChannel.createMessageComponentCollector({ componentType: ComponentType.Button });

                collector2.on('collect', i => {
                    if (i.customId === 'close-ticket') {
                        if (!i.member.permissions.has('ManageMessages')) return;
                        ticketChannel2.delete();
                    };
                });
                break;
        };
    },
};