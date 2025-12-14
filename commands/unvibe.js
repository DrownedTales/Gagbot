const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getChastity, getVibe, removeVibe } = require('./../functions/vibefunctions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unvibe')
		.setDescription('Remove a vibrator')
        .addUserOption(opt =>
            opt.setName('user')
            .setDescription('Who to remove the vibrator from')
        ),
    async execute(interaction) {
        let vibeuser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user
        if (getChastity(vibeuser.id)) {
            // The target is in a chastity belt
            if ((getChastity(vibeuser.id)?.keyholder == interaction.user.id)) {
                // User tries to modify the vibe settings for someone in chastity that they do have the key for
                if (vibeuser == interaction.user) {
                    // User tries to modify their own vibe settings while in chastity
                    if (getVibe(vibeuser.id)) {
                        // User already has a vibrator on
                        interaction.reply(`${interaction.user} unlocks their belt, removing the vibrator and then locks it back up!`)
                        removeVibe(vibeuser.id)
                    }
                    else {
                        interaction.reply({ content: `You don't have a vibrator on!`, flags: MessageFlags.Ephemeral })
                    }
                }
                else {
                    // User tries to modify another user's vibe settings
                    if (getVibe(vibeuser.id)) {
                        // User already has a vibrator on
                        interaction.reply(`${interaction.user} unlocks ${vibeuser}'s belt, removing the vibrator and then locks it back up!`)
                        removeVibe(vibeuser.id)
                    }
                    else {
                        interaction.reply({ content: `${vibeuser} does not have a vibrator on!`, flags: MessageFlags.Ephemeral })
                    }
                }
            }
            else {
                // User tries to modify vibe settings but does not have the key for the belt
                if (vibeuser == interaction.user) {
                    // User tries to modify their own vibe settings while in chastity
                    if (getVibe(vibeuser.id)) {
                        // User already has a vibrator on
                        interaction.reply(`${interaction.user} claws at their belt, desperately trying to take out the teasing vibrator, but can't!`)
                    }
                    else {
                        interaction.reply({ content: `You don't have a vibrator on!`, flags: MessageFlags.Ephemeral })
                    }
                }
                else {
                    // User tries to modify another user's vibe settings
                    interaction.reply({ content: `You do not have the key for ${vibeuser}'s chastity belt!`, flags: MessageFlags.Ephemeral })
                }
            }
        }
        else {
            // Target is NOT in a chastity belt!
            if (vibeuser == interaction.user) {
                // User tries to modify their own vibe settings
                if (getVibe(vibeuser.id)) {
                    // User already has a vibrator on
                    interaction.reply(`${interaction.user} takes their vibrator out!`)
                    removeVibe(vibeuser.id)
                }
                else {
                    interaction.reply({ content: `You don't have a vibrator on!`, flags: MessageFlags.Ephemeral })
                }
            }
            else {
                // User tries to modify another user's vibe settings
                if (getVibe(vibeuser.id)) {
                    // User already has a vibrator on
                    interaction.reply(`${interaction.user} takes the vibrator out from ${vibeuser}!`)
                    removeVibe(vibeuser.id)
                }
                else {
                    interaction.reply({ content: `${vibeuser} does not have a vibrator on!`, flags: MessageFlags.Ephemeral })
                }
            }
        }
    }
}