const { WebhookClient, AttachmentBuilder } = require('discord.js');

const messageSend = async (str, avatarURL, username) => {
    // When called, we want to do something with str and then send it.
    const webhookClient = new WebhookClient({ 
        id: process.env.WEBHOOKID, 
        token: process.env.WEBHOOKTOKEN 
    })

    webhookClient.send({
        content: str,
        username: username,
        avatarURL: avatarURL
    }).then(() => {
        return true
    })
}

const messageSendBot = async (str) => {
    // When called, we want to do something with str and then send it.
    const webhookClient = new WebhookClient({ 
        id: process.env.WEBHOOKID, 
        token: process.env.WEBHOOKTOKEN 
    })

    webhookClient.send({
        content: str
    }).then(() => {
        return true
    })
}

const messageSendImg = async (str, avatarURL, username, msgid, spoiler) => {
    // When called, we want to do something with str and then send it.
    const webhookClient = new WebhookClient({ 
        id: process.env.WEBHOOKID, 
        token: process.env.WEBHOOKTOKEN 
    })

    let spoilertext = spoiler ? "SPOILER_" : ""

    let imageonsystem = `./${spoilertext}downloadedimage_${msgid}.png`
    
    let file = new AttachmentBuilder(imageonsystem, { name: imageonsystem } );

    webhookClient.send({
        content: str,
        username: username,
        avatarURL: avatarURL,
        files: [file]
    }).then(() => {
        return true
    })
}

const messageSendDev = async (str, avatarURL, username) => {
    // When called, we want to do something with str and then send it.
    const webhookClient = new WebhookClient({ 
        id: process.env.WEBHOOKIDDEV, 
        token: process.env.WEBHOOKTOKENDEV 
    })

    webhookClient.send({
        content: str,
        username: username,
        avatarURL: avatarURL
    }).then(() => {
        return true
    })
}

exports.messageSend = messageSend;
exports.messageSendImg = messageSendImg;
exports.messageSendDev = messageSendDev;
exports.messageSendBot = messageSendBot;