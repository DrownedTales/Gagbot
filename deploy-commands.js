// Import the Discord library and fs and path and dotenv. 
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Grab all the command files from the commands directory
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if ((command.execute) && (command.data)) {
        commands.push(command.data.toJSON());
    }
	else {
        console.log(`Ignoring file at ./commands/${file} because it does not have either a data or an execute export.`)
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.DISCORDBOTTOKEN);

(async () => {
    const data = await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID),
        { body: commands },
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
})();