const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { Default_Embed_Colour } = require('../../config.json');

class Player {
    constructor(user, sign) {
        this.user = user;
        this.sign = sign;
    }
}

class Game {
    constructor(user1, user2, interaction) {
        this._player1 = new Player(user1, "❌");
        this._player2 = new Player(user2, "⭕");
        this._currentPlayer = Math.random() < 0.5 ? this._player1 : this._player2;
        this._winner = null;
        this._interaction = interaction;
        this._cells = [];

        // Fill the board with empty data.
        for(let i = 0; i < 9; i++) {
            this._cells[i] = 0;
        }
        
        this._embed = new EmbedBuilder()
            .setTitle(`⚔️ ${this._player1.user.username} vs ${this._player2.user.username}`)
            .setDescription(`${this._currentPlayer.sign} ${this._currentPlayer.user} Your turn!`)
            .setColor(Default_Embed_Colour);

        // Prepare the grid.
        this._row1 = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('primary0')
					.setLabel(' ')
					.setStyle(ButtonStyle.Secondary),
			)
            .addComponents(
				new ButtonBuilder()
					.setCustomId('primary1')
					.setLabel(' ')
					.setStyle(ButtonStyle.Secondary),
			)
            .addComponents(
				new ButtonBuilder()
					.setCustomId('primary2')
					.setLabel(' ')
					.setStyle(ButtonStyle.Secondary),
			);

        this._row2 = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('primary3')
					.setLabel(' ')
					.setStyle(ButtonStyle.Secondary),
			)
            .addComponents(
				new ButtonBuilder()
					.setCustomId('primary4')
					.setLabel(' ')
					.setStyle(ButtonStyle.Secondary),
			)
            .addComponents(
				new ButtonBuilder()
					.setCustomId('primary5')
					.setLabel(' ')
					.setStyle(ButtonStyle.Secondary),
			);

        this._row3 = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('primary6')
					.setLabel(' ')
					.setStyle(ButtonStyle.Secondary),
			)
            .addComponents(
				new ButtonBuilder()
					.setCustomId('primary7')
					.setLabel(' ')
					.setStyle(ButtonStyle.Secondary),
			)
            .addComponents(
				new ButtonBuilder()
					.setCustomId('primary8')
					.setLabel(' ')
					.setStyle(ButtonStyle.Secondary),
			);
    }

    async updateGrid(interaction, player) {
        // Check if the player tries to play during the other player's turn.
        if(interaction.user.id !== player.user.id) {
            await interaction.reply({ content: "It's not your turn!", ephemeral: true });
            return;
        };

        // Retrieve the position from the custom id of the button(customd id of primary1 will be 1).
        const position = parseInt(interaction.customId.charAt(interaction.customId.length - 1));

        if(!this.isMoveValid(position)) {
            await interaction.reply({ content: 'Your move is invalid! This cell is already occupied. Try with another move.', ephemeral: true });
            return;
        };

        // Check the rows for the clicked button and update it with the new label.
        this._row1.components.forEach(c => {
            if (c.data.custom_id == interaction.customId) {
                c.setLabel(player.sign);
                this._cells[position] = player.sign;
            }
        });

        this._row2.components.forEach(c => {
            if (c.data.custom_id == interaction.customId) {
                c.setLabel(player.sign);
                this._cells[position] = player.sign;
            }
        });

        this._row3.components.forEach(c => {
            if (c.data.custom_id == interaction.customId) {
                c.setLabel(player.sign);
                this._cells[position] = player.sign;
            }
        });

        // Check if there are any matches.
        this.checkMatches();

        // Check if the winner has been declared.
        if(this._winner != null) {
            this._embed.setDescription(`${this._currentPlayer.user} wins! 🎉`);
            await interaction.update({ embeds: [this._embed], content: '', });
            return;
        };

        // Set the current player to the next player for the next move.
        this._currentPlayer = this.nextPlayer(this._currentPlayer);

        this._embed.setDescription(`${this._currentPlayer.sign} ${this._currentPlayer.user} Your turn!`);
        await interaction.update({ embeds: [this._embed], content: '', components: [this._row1, this._row2, this._row3] });
    };

    async run() {
        const resp = await this._interaction.reply({ embeds: [this._embed], content: `Starting the game for <@${this._player1.user.id}> and <@${this._player2.user.id}>`, components: [this._row1, this._row2, this._row3] });

        const collector = resp.createMessageComponentCollector();

        collector.on('collect', async i => {
            if (i.isButton()) this.updateGrid(i, this._currentPlayer);
        });
            
    };

    checkMatches() {
        // Check horizontally
        for(let row = 0; row < 3; row++) {
            const v1 = this._cells[this.posToIndex(row, 0)];
            const v2 = this._cells[this.posToIndex(row, 1)];
            const v3 = this._cells[this.posToIndex(row, 2)];

            if(this.validEquals(v1, v2) && this.validEquals(v2, v3))
                this._winner = v1;

        };

        // Check vertically
        for(let column = 0; column < 3; column++) {
            const v1 = this._cells[this.posToIndex(0, column)];
            const v2 = this._cells[this.posToIndex(1, column)];
            const v3 = this._cells[this.posToIndex(2, column)];

            if(this.validEquals(v1, v2) && this.validEquals(v2, v3))
                this._winner = v1;

        };

        // Check diagonally
        const middle = this._cells[this.posToIndex(1, 1)];
        const topLeft = this._cells[this.posToIndex(0, 0)];
        const topRight = this._cells[this.posToIndex(0, 2)];
        const bottomRight = this._cells[this.posToIndex(2, 2)];
        const bottomLeft = this._cells[this.posToIndex(2, 0)];

        if (this.validEquals(topLeft, middle) && this.validEquals(middle, bottomRight))
            this._winner = topLeft

        if (this.validEquals(topRight, middle) && this.validEquals(middle, bottomLeft))
            this._winner = topRight;

    };

    nextPlayer(currentPlayer) {
        if(currentPlayer == this._player1)
            return this._player2;
        else
            return this._player1;
    };

    posToIndex(row, column) {
        return row * 3 + column;
    };

    isMoveValid(position) {
        return this._cells[position] == 0 ? true: false
    };

    validEquals(cell1, cell2) {
        return ( cell1 !== 0 && cell1 == cell2 )
    };
};

module.exports.Game = Game;