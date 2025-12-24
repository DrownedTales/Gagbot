
const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require('discord.js');

const { getUserVar, setUserVar } = require("../functions/usercontext.js");
const { assignVibe, getVibe } = require("../functions/vibefunctions.js");
const { messageSendBot } = require("../functions/messagefunctions.js");
const { getPronouns } = require("../functions/pronounfunctions.js");


// This vibe triggers when you say certain words set by the user. The words are hidden for the target so I don't see how this could lead to trouble,
// but if it gets rejected we could switch to a randomly chosen list of common words, or limit this specific vibe to collar owners for an extra layer of safety

async function extraParameters(interaction, user, intensity, type) {
    async function showForm(interaction) {
        const modal = new ModalBuilder()
        .setCustomId('wordbuzzer')
        .setTitle('Word buzzer settings');

        const wordList = new TextInputBuilder()
        .setCustomId('wordlist')
        .setLabel('Word list (separated by commas (,)')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMinLength(1);

        const duration = new TextInputBuilder()
        .setCustomId('duration')
        .setLabel('Duration of vibrations (in seconds)')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(1);

        const peakintensity = new TextInputBuilder()
        .setCustomId('peakintensity')
        .setLabel('Intensity of vibrations triggered (1 to 30)')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(1);

        const row = new ActionRowBuilder().addComponents(wordList);
        const row2 = new ActionRowBuilder().addComponents(duration);
        const row3 = new ActionRowBuilder().addComponents(peakintensity);

        modal.addComponents(row, row2, row3);

        await interaction.showModal(modal);
    }

    await showForm(interaction);

    let modalInteraction;
    try {
        modalInteraction = await interaction.awaitModalSubmit({
            filter: (i) => i.customId === 'wordbuzzer' && i.user.id === interaction.user.id,
            time: 60_000,
        });
    } catch (err) {
        console.log(err);
        return;
    }

    const wordListInput = modalInteraction.fields.getTextInputValue('wordlist');
    const durationInput = modalInteraction.fields.getTextInputValue('duration');
    const peakintensityInput = modalInteraction.fields.getTextInputValue('peakintensity');

    const wordsArray = wordListInput.split(',').map(word => word.trim()).filter(word => word !== ''); // Remove empty strings
    const durationInt = parseInt(durationInput);
    const peakintensityInt = parseInt(peakintensityInput);

    if (wordsArray.length === 0 || isNaN(durationInt) || isNaN(peakintensityInt) || peakintensityInt < 1 || peakintensityInt > 30) {
        await modalInteraction.reply({ content: 'Invalid input. Please try again.', ephemeral: true });
        return;
    }
    
    return async (defaultText) => {
        setUserVar(user.id, 'wordbuzzerwords', wordsArray);
        setUserVar(user.id, 'wordbuzzerduration', durationInt);
        setUserVar(user.id, 'wordbuzzerpeakintensity', peakintensityInt);
        setUserVar(user.id, "wordbuzzerogintensity", intensity);
        assignVibe(user.id, intensity, type);
        await modalInteraction.reply({
            content: `You set @<@${user.id}>'s word buzzer with words: [${wordsArray.join(', ')}] for ${durationInt} seconds with intensity ${peakintensityInt}.`,
            ephemeral: true
        });
        await modalInteraction.followUp({
            content: defaultText
        });
    };
}

function onAssign(user, intensity, interaction = null) {
    setUserVar(user, "wordbuzzercurrentduration", 0);
    setUserVar(user, "wordbuzzertriggercount", 0);
}

function onMessage(msg, intensity, messageparts=null) {
    if (!getVibe(msg.author.id).some(vibe => vibe.vibetype == "word buzzer")) { return }

    const vibeWords = getUserVar(msg.author.id, 'wordbuzzerwords');
    const duration = getUserVar(msg.author.id, 'wordbuzzerduration');
    const peakintensity = getUserVar(msg.author.id, 'wordbuzzerpeakintensity');
    const currentduration = getUserVar(msg.author.id, 'wordbuzzercurrentduration');
    if (!currentduration) { setUserVar(msg.author.id, 'wordbuzzercurrentduration', 0); }
    const triggercount = getUserVar(msg.author.id, 'wordbuzzertriggercount');
    if (!triggercount) { setUserVar(msg.author.id, 'wordbuzzertriggercount', 0); }
    const ogintensity = getUserVar(msg.author.id, 'wordbuzzerogintensity');
    if (ogintensity == undefined) {
        messageSendBot("<@1304866694929322078> they broke me again please help TwT");
        return;
     }

    if (vibeWords == undefined || duration == undefined || peakintensity == undefined) { return }

    for (const part of messageparts) {
        const words = part.text.split(' ');
        const triggerWords = words.filter(word => vibeWords.includes(word));

        if (triggerWords.length > 0) {            
            assignVibe(msg.author.id, peakintensity, "word buzzer");
            setUserVar(msg.author.id, 'wordbuzzertriggercount', triggercount + 1);

            if (currentduration == 0) {
                messageSendBot(`Oh my~ <@${msg.author.id}> said a trigger word, and now ${getPronouns(msg.author.id, 'possessiveDeterminer')} word buzzer is set to ${peakintensity} for ${duration + currentduration} seconds. Enjoy~`);
            } else {
                messageSendBot(`<@${msg.author.id}> said a trigger word again, and now ${getPronouns(msg.author.id, 'possessiveDeterminer')} word buzzer is set to ${peakintensity} for ${duration + currentduration} seconds. Keep sinking deeper~`);
            }

            // This whole code is necessary in case someone triggers multiple times. so I have a variable that accumulates each trigger and waits for all the timeouts
            // until reseting the intensity. it is very important to make sure the triggercount goes to 0 correctly or the vibe will stop working, so I'm resetting it on
            // assign and remove too. this would be much easier if I could make an update loop in discord js though xD
            // and ofc has the problem that the remaining time doesn't update so if you trigger, you're stuck with all the accumulated time again xD
            setTimeout(() => {
                console.log("buzzer timeout");
                if (!getVibe(msg.author.id).some(vibe => vibe.vibetype == "word buzzer")) { return }
                
                let currentTriggerCount = getUserVar(msg.author.id, 'wordbuzzertriggercount');
                console.log("buzzer trigger count: " + currentTriggerCount);

                if (currentTriggerCount == undefined) {
                    setUserVar(msg.author.id, 'wordbuzzertriggercount', 0);
                } else {
                    currentTriggerCount -= 1;
                    setUserVar(msg.author.id, 'wordbuzzertriggercount', currentTriggerCount);
                }

                if (currentTriggerCount == 0) { 
                    console.log("buzzer reset");
                    const ogintensity = getUserVar(msg.author.id, 'wordbuzzerogintensity');
                    assignVibe(msg.author.id, ogintensity, "word buzzer");
                    setUserVar(msg.author.id, 'wordbuzzertriggercount', 0);
                    setUserVar(msg.author.id, 'wordbuzzercurrentduration', 0);
                    messageSendBot(`<@${msg.author.id}>'s word buzzer is back to ${ogintensity}. For now~`);
                }
            }, (duration + currentduration) * 1000);

            setUserVar(msg.author.id, 'wordbuzzercurrentduration', currentduration + duration);

            return;
        }
    }
}

function onRemove(user, intensity, interaction = null) {
    setUserVar(user, "wordbuzzerwords", null);
    setUserVar(user, "wordbuzzerduration", null);
    setUserVar(user, "wordbuzzerpeakintensity", null);
    setUserVar(user, "wordbuzzerogintensity", null);
    setUserVar(user, "wordbuzzercurrentduration", 0);
    setUserVar(user, "wordbuzzertriggercount", 0);
}

exports.choicename = "Word Buzzer";
exports.extraParameters = extraParameters;
exports.onMessage = onMessage;
exports.onAssign = onAssign;
exports.onRemove = onRemove;