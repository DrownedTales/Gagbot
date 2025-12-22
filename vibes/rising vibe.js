const { getVibe, assignVibe } = require('../functions/vibefunctions.js')
const { setUserVar, getUserVar } = require('../functions/usercontext.js')
const { messageSendBot } = require('../functions/messagefunctions.js')
const { getPronouns } = require('../functions/pronounfunctions.js')

function onAssign (user, intensity) {
    setUserVar(user, "n_of_messages", 0);
}

function onMessage (msg, intensity, messageparts=null) {
    if (!getVibe(msg.author.id).some(vibe => vibe.vibetype == "rising vibe")) { return }
    if (getVibe(msg.author.id).find(vibe => vibe.vibetype == "rising vibe").intensity >= 30) { return }

    const n_of_messages = getUserVar(msg.author.id, "n_of_messages");
    if (n_of_messages == undefined) { 
        setUserVar(msg.author.id, "n_of_messages", 0);
        n_of_messages = 0;
    }
    
    // + 25% for each message. Increase from 3-7
    if ((0.25 * n_of_messages) > Math.random()) {
        const newintensity = Math.min(intensity + Math.floor(Math.random() * 4) + 3, 30);
        assignVibe(msg.author.id, newintensity, "rising vibe");
        messageSendBot(`Oooops! <@${msg.author.id}>'s rising vibe increases it's intensity to ${newintensity}. Maybe ${getPronouns(msg.author.id, 'subject')} should try talking a little less~`);
        setUserVar(msg.author.id, "n_of_messages", 0);
    } else {
        setUserVar(msg.author.id, "n_of_messages", n_of_messages + 1);
    }
}

function onRemove (user, intensity) {
    setUserVar(user, "n_of_messages", 0);
}

exports.choicename = "Rising Vibe";
exports.onMessage = onMessage;
exports.onAssign = onAssign;
exports.onRemove = onRemove;