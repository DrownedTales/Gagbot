const { WebhookClient, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const dotenv = require('dotenv')
const fs = require('fs');
const { getVibe, vibeText } = require("./functions/vibefunctions.js")

dotenv.config()

try {
    process.vibe = JSON.parse(fs.readFileSync(`./vibeusers.txt`))
}
catch (err) { 
    console.log(err);
}

console.log(process.vibe)
console.log(getVibe("603967231155634176"))

console.log("Testing vibe code with this string!");
console.log(vibeText("Testing vibe code with this string!", "603967231155634176"))