const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getChastity, getVibe, assignVibe } = require('./../functions/vibefunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')
const fs = require('fs');
const path = require('path');

const vibetypes = [];
const commandsPath = path.join(__dirname, '..', 'vibes');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const vibe = require(`./../vibes/${file}`);
	vibetypes.push(
        { name: vibe.choicename, value: file.replace('.js', '') }
    );
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vibe')
		.setDescription('Add a vibrator/toy, causing stuttered speech and other effects')
        .addUserOption(opt =>
            opt.setName('user')
            .setDescription('Who to add a fun vibrator to')
        )
        .addStringOption(opt =>
            opt.setName('type')
            .setDescription('What kind of vibe to add')
            .addChoices(...vibetypes)
        )
		.addNumberOption(opt => 
            opt.setName('intensity')
            .setDescription("How intensely to stimulate")
            .setMinValue(0)
            .setMaxValue(30)
        ),
    async execute(interaction) {
        try {
            let vibeuser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user
            let vibeintensity = interaction.options.getNumber('intensity') != undefined ? interaction.options.getNumber('intensity') : 5
            let vibetype = interaction.options.getString('type') ? interaction.options.getString('type') : "bullet vibe"
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(vibeuser.id)?.mainconsent) {
                await handleConsent(interaction, vibeuser.id);
                return;
            }
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(interaction.user.id)?.mainconsent) {
                await handleConsent(interaction, interaction.user.id);
                return;
            }

            if (getHeavy(interaction.user.id)) {
                if (vibeuser == interaction.user) {
                    if (getChastity(vibeuser.id)) {
                        interaction.reply(`${interaction.user} bats around a ${vibetype} despite ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}, but ${getPronouns(interaction.user.id, "subject")} can't insert it because of ${getPronouns(interaction.user.id, "possessiveDeterminer")} chastity belt! And well, ${getPronouns(interaction.user.id, "subject")} ${getPronouns(interaction.user.id, "subject") != "they" ? "doesn't" : "don't"} have arms!`)
                    }
                    else {
                        interaction.reply(`${interaction.user} stares at a ${vibetype}, longing to feel its wonderful vibrations, but sighing in frustration because ${getPronouns(interaction.user.id, "subject")} ${getPronouns(interaction.user.id, "subject") != "they" ? "is" : "are"} in a ${getHeavy(interaction.user.id).type} and can't put it on!`)
                    }
                }
                else {
                    if (getChastity(vibeuser.id)) {
                        interaction.reply(`${interaction.user} uses ${getPronouns(interaction.user.id, "possessiveDeterminer")} chin to move a ${vibetype} towards ${vibeuser} before realizing ${getPronouns(interaction.user.id, "subject")} can't put it on ${getPronouns(vibeuser.id, "object")} because of ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type} and ${vibeuser}'s chastity belt!`)
                    }
                    else {
                        interaction.reply(`${interaction.user} rubs ${getPronouns(interaction.user.id, "possessiveDeterminer")} cheek on the ${vibetype}, trying to move it and put it on ${vibeuser}. It's a shame ${getPronouns(interaction.user.id, "subject")} ${getPronouns(interaction.user.id, "subject") != "they" ? "doesn't" : "don't"} have arms because of ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}!`)
                    }
                }
            }
            else if (getChastity(vibeuser.id)) {
                // The target is in a chastity belt
                if (vibetype == "remote vibe" && getVibe(vibeuser.id) && (getVibe(vibeuser.id).some((vibe) => (vibe.vibetype == vibetype)))) {
                    //Exception for remote vibe to bypass chastity
                    if (vibeuser == interaction.user) {
                        // User modifies their own vibe settings while in chastity
                        auxAssign(`${interaction.user} uses ${getPronouns(interaction.user.id, "possessiveDeterminer")} remote control to change ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${vibetype} intensity to ${vibeintensity}!`,
                            interaction, vibeuser, vibeintensity, vibetype);
                    } else {
                        // User modifies another user's vibe settings
                        auxAssign(`${interaction.user} uses ${getPronouns(interaction.user.id, "possessiveDeterminer")} remote control to change ${vibeuser}'s ${vibetype} intensity to ${vibeintensity}!`, 
                            interaction, vibeuser, vibeintensity, vibetype);
                    }
                }
                else if ((getChastity(vibeuser.id)?.keyholder == interaction.user.id || (getChastity(vibeuser.id)?.access === 0 && vibeuser.id != interaction.user.id))) {
                    // User tries to modify the vibe settings for someone in chastity that they do have the key for
                    if (vibeuser == interaction.user) {
                        // User tries to modify their own vibe settings while in chastity
                        if (getVibe(vibeuser.id) && (getVibe(vibeuser.id).some((vibe) => (vibe.vibetype == vibetype)))) {
                            // User already has the same vibrator on
                            auxAssign(`${interaction.user} unlocks ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt, changing the ${vibetype} setting to ${vibeintensity} and then locks it back up!`,
                                interaction, vibeuser, vibeintensity, vibetype);
                        }
                        else {
                            // User adds a vibe
                            auxAssign(`${interaction.user} unlocks ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt, adding a ${vibetype} set to ${vibeintensity} and then locks it back up!`,
                                interaction, vibeuser, vibeintensity, vibetype);
                        }
                    }
                    else {
                        // User tries to modify another user's vibe settings
                        if (getVibe(vibeuser.id) && (getVibe(vibeuser.id).some((vibe) => (vibe.vibetype == vibetype)))) {
                            // User already has a vibrator of same type on
                            auxAssign(`${interaction.user} unlocks ${vibeuser}'s belt, changing the ${vibetype} setting to ${vibeintensity} and then locks it back up!`,
                                interaction, vibeuser, vibeintensity, vibetype);
                        }
                        else {
                            // User adds a vibe
                            auxAssign(`${interaction.user} unlocks ${vibeuser}'s belt, adding a ${vibetype} set to ${vibeintensity} and then locks it back up!`, 
                                interaction, vibeuser, vibeintensity, vibetype);
                        }
                    }
                }
                else {
                    // User tries to modify vibe settings but does not have the key for the belt
                    if (vibeuser == interaction.user) {
                        // User tries to modify their own vibe settings while in chastity
                        if (getVibe(vibeuser.id)) {
                            // User already has a vibrator on
                            interaction.reply(`${interaction.user} claws at ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt, feverishly trying to change the vibrators settings, but can't!`)
                        }
                        else {
                            interaction.reply(`${interaction.user} runs ${getPronouns(interaction.user.id, "possessiveDeterminer")} fingers on ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt, trying to turn on a vibrator, but can't!`)
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
                    if (getVibe(vibeuser.id) && (getVibe(vibeuser.id).some((vibe) => (vibe.vibetype == vibetype)))) {
                        // User already has a vibrator of the same type on
                        auxAssign(`${interaction.user} changes ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${vibetype} setting to ${vibeintensity}!`,
                            interaction, vibeuser, vibeintensity, vibetype);
                    }
                    else {
                        // User adds a vibe
                        auxAssign(`${interaction.user} slips on a ${vibetype} set to ${vibeintensity}!`, 
                            interaction, vibeuser, vibeintensity, vibetype);
                    }
                }
                else {
                    // User tries to modify another user's vibe settings
                    if (getVibe(vibeuser.id) && (getVibe(vibeuser.id).some((vibe) => (vibe.vibetype == vibetype)))) {
                        // User already has a vibrator of same type on
                        auxAssign(`${interaction.user} changes ${vibeuser}'s ${vibetype} setting to ${vibeintensity}!`, 
                            interaction, vibeuser, vibeintensity, vibetype);
                    }
                    else {
                        // User adds a vibe
                        auxAssign(`${interaction.user} slips a ${vibetype} on ${vibeuser} set to ${vibeintensity}!`, 
                            interaction, vibeuser, vibeintensity, vibetype);
                    }
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}

// Ask for extra parameters in case there's stuff we want to ask and execute before the regular assignVibe
//  (couldn't think of a cleaner solution while keeping the same command)
async function auxAssign(defaultText, interaction, vibeuser, vibeintensity, vibetype) {
    let onConfirm = null;
    try {
        const vibe = require(path.join(commandsPath, `${vibetype}.js`));
        if (vibe.extraParameters) {
            onConfirm = await vibe.extraParameters(interaction, vibeuser, vibeintensity, vibetype);
        }
    } catch (err) { console.log(err) }

    if (onConfirm) {
        await onConfirm(defaultText);
    } else {
        interaction.reply(defaultText);
        assignVibe(vibeuser.id, vibeintensity, vibetype);
    }
}