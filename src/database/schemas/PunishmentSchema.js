const { Schema, model } = require('mongoose');

module.exports = model(
	'PunishmentDB',
	new Schema({
		Type: String,
		CaseID: String,
		GuildID: String,
		UserID: String,
		UserTag: String,
		Content: Array,
	}),
);
