console.clear();

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { connect } = require('mongoose');
require('dotenv/config');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
    ],
    allowedMentions: { parse: ['users', 'roles'] },
});

client.commands = new Collection();

const handlerFiles = readdirSync('./src/handlers/').filter(file => file.endsWith('.js'));
for (const file of handlerFiles) require(`./handlers/${file}`)(client);

const systemFolders = readdirSync('./src/systems/');
for (const folder of systemFolders) {
    const systemFiles = readdirSync(`./src/systems/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of systemFiles) require(`../src/systems/${folder}/${file}`)(client);    
};

client.handleCommands();
client.handleEvents();
client.login(process.env.BOT_TOKEN).then(() => {
    //connect(process.env.MONGO_URI).then(() => console.log("[Database Status]: Connected"));
});