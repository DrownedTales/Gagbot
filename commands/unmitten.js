const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getMitten, deleteMitten } = require('./../functions/gagfunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmitten')
		.setDescription(`Take someone else's mittens off`)
		.addUserOption(opt =>
			opt.setName('user')
			.setDescription('Who to free from their mittens')
		),
    async execute(interaction) {
		let mitteneduser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user
		if (getHeavy(interaction.user.id)) {
			if (interaction.options.getUser('user') == interaction.user) {
            	interaction.reply(`${interaction.user} wriggles their hands in their ${getHeavy(interaction.user.id).type}, but can't get good leverage to take their mittens off!`)
			}
			else {
				interaction.reply(`${interaction.user} uses their nose because of their ${getHeavy(interaction.user.id).type}, but can't help ${interaction.options.getUser('user')} out of their mittens!`)
			}
        }
        else if (mitteneduser == interaction.user) {
            interaction.reply(`${interaction.user} tries to take their mittens off, but can't get a good grip on the straps!`)
        }
		else if (getMitten(mitteneduser)) {
            deleteMitten(mitteneduser)
            interaction.reply(`${interaction.user} takes off ${mitteneduser}'s mittens so they can take off their gag!`)
        }
		else {
			interaction.reply({ content: `${mitteneduser} is not wearing mittens!`, flags: MessageFlags.Ephemeral })
        }
    }
}