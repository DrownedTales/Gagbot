const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { assignMitten, getMitten } = require('./../functions/gagfunctions.js')
const { calculateTimeout } = require("./../functions/timefunctions.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mitten')
		.setDescription('Put mittens on yourself, preventing /ungag on yourself and /gag on others')
		/*.addStringOption(opt =>
			opt.setName('timelength')
			.setDescription('Human Readable Text (_days _ hours _ mins)')
		)
        .addBooleanOption(opt => 
            opt.setName('infinite')
            .setDescription("'Forget' a timelock - requires others to help you out")
        )*/,
    async execute(interaction) {
		if (getMitten(interaction.user)) {
            interaction.reply({ content: `You are already wearing mittens!`, flags: MessageFlags.Ephemeral })
        }
        else {
            assignMitten(interaction.user);
            interaction.reply(`${interaction.user} puts on a pair of mittens with a pair of padlocks. They'll be unable to remove their gag!`)
        }
    }
}