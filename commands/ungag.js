const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getGag, deleteGag, getMitten } = require('./../functions/gagfunctions.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ungag')
        .setDescription('Remove a gag from a user')
        .addUserOption(opt =>
            opt.setName('user')
            .setDescription('The user to remove gag from (leave blank for yourself)')
            //.setRequired(true)
        ),
    async execute(interaction) {
        let gaggeduser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user;
        if (getGag(gaggeduser)) {
            if (interaction.user == gaggeduser) {
                if (!getMitten(interaction.user)) {
                    interaction.reply(`${interaction.user} has taken their gag out!`)
                    deleteGag(gaggeduser)
                }
                else {
                    interaction.reply(`${interaction.user} attempts to take their gag off, but struggles with the straps in their mittens!`)
                }
            }
            else {
                deleteGag(gaggeduser)
                interaction.reply(`${interaction.user} has freed ${gaggeduser} from their gag!`)
            }
        }
        else {
            interaction.reply({ content: `${gaggeduser} is not gagged!`, flags: MessageFlags.Ephemeral })
        }
    }
}