
const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  TextDisplayBuilder
} = require('discord.js');

const { setUserVar, getUserVar } = require("../functions/usercontext.js");
const { assignVibe, getVibe } = require("../functions/vibefunctions.js");
const { messageSendBot } = require("../functions/messagefunctions.js");
const { getPronouns } = require("../functions/pronounfunctions.js");



async function extraParameters(interaction, user, intensity, type) {
    async function showForm(interaction) {
        const modal = new ModalBuilder()
        .setCustomId('timedvibe')
        .setTitle('Timed vibe settings');

        const descriptionText = new TextDisplayBuilder()
        descriptionText.setContent(`This vibe will be active until the time specified below has passed, or until somehow modified.
Please enter the time in the format h m s. For example 2 3 4, or 2 hours 3 minutes 4 seconds, or 2h 3m 4s, would all be equal to be 2 hours, 3 minutes, and 4 seconds.`
        );

        const time = new TextInputBuilder()
        .setCustomId('time')
        .setLabel('Time (h m s)')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(1);

        const row = new ActionRowBuilder().addComponents(time);

        modal.addComponents(row, descriptionText);

        await interaction.showModal(modal);
    }

    await showForm(interaction);

    let modalInteraction;
    try {
        modalInteraction = await interaction.awaitModalSubmit({
            filter: (i) => i.user.id === interaction.user.id,
            time: 30000,
        });
    } catch (err) {
        console.log(err);
    }

    const time = modalInteraction.fields.getTextInputValue('time');

    if (time) {
      
      
      if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
          return modalInteraction.reply('Invalid time format. Please use "h m s" format.');
      }
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      if (totalSeconds <= 0) {
          return modalInteraction.reply('Time must be greater than 0 seconds.');
      }

      return async (defaultText) => {
        const id = Math.floor(Math.random() * 10000 + Math.random() * 1000 + Math.random() * 100 + Math.random() * 10 + Math.random());
        setUserVar(user, "timedvibetimeid", id);
        setUserVar(user, "timedvibetime", totalSeconds);
        assignVibe(user, intensity, type);

        setTimeout(() => {
          if (id == getUserVar(user, "timedvibetimeid")) {
            assignVibe(user, 0, type);
            const timeInSeconds = getUserVar(user, "timedvibetime");
            const hours = Math.floor(timeInSeconds / 3600);
            const minutes = Math.floor((timeInSeconds % 3600) / 60);
            const seconds = timeInSeconds % 60;
            messageSendBot(modalInteraction.client.channels.fetch(process.env.CHANNELID), `<@${user}>'s timed vibe turns off after `);
          }
          setUserVar(user, "timedvibetimeid", null);            
        }, totalSeconds * 1000);

        await modalInteraction.reply({
          content: `${user} slips in a timed vibe set for ${hours} hours, ${minutes} minutes, and ${seconds} seconds at intensity ${intensity}!`
        });
      };

    } else {
      return interaction.reply('Invalid time format. Please use "h m s" format.');
    }

}

function parseTime() {

}

exports.choicename = "Timed Vibe";
exports.extraParameters = extraParameters;