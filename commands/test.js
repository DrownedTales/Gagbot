const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getMitten, deleteMitten } = require('./../functions/gagfunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent, timelockChastityModal } = require('./../functions/interactivefunctions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription(`Testing Timelock Modal`),
    async execute(interaction) {
		try {
			if (interaction.user.id != "125093095405518850") {
                await interaction.reply("You're not Enraa. No. <:NijikaGrin:1051258841913905302>")
                return
            }
            interaction.showModal(timelockChastityModal(interaction, interaction.user))
		}
		catch (err) {
			console.log(err)
		}
    }
}