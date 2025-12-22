const { SlashCommandBuilder, ComponentType, ButtonStyle, MessageFlags } = require('discord.js');
const { getMitten, deleteMitten } = require('./../functions/gagfunctions.js')
const { getHeavy, commandsheavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent, timelockChastityModal } = require('./../functions/interactivefunctions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
        .setDescription(`Put heavy bondage on, preventing the use of any command`)
        .addStringOption(opt =>
			opt.setName('type')
			.setDescription('What flavor of helpless restraint to wear...')
			.setRequired(true)
			.setAutocomplete(true)
	),
	async autoComplete(interaction) {
		const focusedValue = interaction.options.getFocused(); 
		if (focusedValue == "") { // User hasn't entered anything, lets give them a suggested set of 10
			let heaviestoreturn = [
				{ name: "Latex Armbinder", value: "armbinder_latex" },
				{ name: "Shadow Latex Armbinder", value: "armbinder_shadowlatex" },
				{ name: "Wolfbinder", value: "armbinder_wolf" },
				{ name: "Ancient Armbinder", value: "armbinder_ancient" },
				{ name: "High Security Armbinder", value: "armbinder_secure" },
				{ name: "Latex Boxbinder", value: "boxbinder_latex" },
				{ name: "Comfy Straitjacket", value: "straitjacket_comfy" },
				{ name: "Maid Straitjacket", value: "straitjacket_maid" },
				{ name: "Doll Straitjacket", value: "straitjacket_doll" },
				{ name: "Shadow Latex Petsuit", value: "petsuit_shadowlatex" },
			]
			await interaction.respond(heaviestoreturn)
		}
		else {
			let heavies = commandsheavy.filter((f) => f.name.includes(focusedValue)).slice(0,10)
			await interaction.respond(heavies)
		}
	},
    async execute(interaction) {
		try {
			if (interaction.user.id != "125093095405518850") {
                await interaction.reply("You're not Enraa. No. <:NijikaGrin:1051258841913905302>")
                return
            }
			const keyType = interaction.options.getSubcommand();
		}
		catch (err) {
			console.log(err)
		}
    }
}