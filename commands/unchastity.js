const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getChastity, removeChastity } = require('./../functions/vibefunctions.js')
const { calculateTimeout } = require("./../functions/timefunctions.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unchastity')
		.setDescription('Remove a chastity belt from someone')
		.addUserOption(opt =>
			opt.setName('wearer')
			.setDescription('Who to unlock...')
            .setRequired(true)
		),
    async execute(interaction) {
		let chastitywearer = interaction.options.getUser('wearer')
        if (getChastity(chastitywearer.id)) {
            // Target is in a belt
            if (getChastity(chastitywearer.id).keyholder != interaction.user.id) {
                // User is NOT the keyholder for the target belt
                if (interaction.user == chastitywearer) {
                    // Wearer is trying to unlock their own belt
                    interaction.reply(`${interaction.user} runs their fingers uselessly on the metal of their chastity belt, but can't unlock it without the key!`)
                }
                else {
                    // Trying to unlock someone else's belt 
                    interaction.reply({ content: `You don't have the key for ${chastitywearer} belt!`, flags: MessageFlags.Ephemeral })
                }
            }
            else {
                // User IS the keyholder for the belt. 
                if (interaction.user == chastitywearer) {
                    // Wearer unlocks themselves
                    interaction.reply(`${interaction.user} puts the key in the lock on their belt and unlocks it, letting it fall as they're freed from their prison!`)
                    removeChastity(chastitywearer.id)
                }
                else {
                    // User unlocks someone else
                    interaction.reply(`${interaction.user} unlocks ${chastitywearer}'s belt and unwraps it from their waist!`)
                    removeChastity(chastitywearer.id)
                }
            }
        }
        else {
            // Target is NOT wearing a belt
            interaction.reply({ content: `${chastitywearer} isn't locked in a chastity belt!`, flags: MessageFlags.Ephemeral })
        }
    }
}