const { assignVibe, getVibe } = require("../functions/vibefunctions.js");
const { getUserVar, setUserVar } = require("../functions/usercontext.js");
const { getPronouns } = require("../functions/pronounfunctions.js");
const { messageSendBot } = require("../functions/messagefunctions.js");

function getRandomCount(intensity) {
    // Less probability to change the more intense. cuz I'm evil~
    return Math.floor(Math.random() * 4) + Math.ceil(Math.random() * 4 * (intensity / 30));
}

function onAssign (user, intensity) {
    setUserVar(user, "random_vibe_count", getRandomCount(intensity));
}

function onMessage (msg, intensity) {
    if (!getVibe(msg.author.id).some(vibe => vibe.vibetype == "random vibe")) { return }
    if (getUserVar(msg.author.id, "random_vibe_count") == undefined) { setUserVar(msg.author.id, "random_vibe_count", getRandomCount(intensity)); }

    if (getUserVar(msg.author.id, "random_vibe_count") > 0) {
        setUserVar(msg.author.id, "random_vibe_count", getUserVar(msg.author.id, "random_vibe_count") - 1);
    } else {
        var newintensity = null; 
        let difference = 0;
        let tries = 0;
        do {
            newintensity = Math.min(Math.floor(Math.random() * 30) + 1, 30);
            difference = Math.abs(newintensity - intensity);
            tries++;
        } while (difference <= 5 || tries > 15);  // Prevent infinite loops

        assignVibe(msg.author.id, newintensity, "random vibe");

        if (intensity <= newintensity) {
            messageSendBot(`<@${msg.author.id}>'s random vibe changed it's intensity to ${newintensity}. Better luck next time~`);
        } else {
            messageSendBot(`<@${msg.author.id}>'s random vibe changed it's intensity to ${newintensity}. Looks like ${getPronouns(msg.author.id, 'subject')} ${getPronouns(msg.author.id, 'subject') != "they" ? "was" : "were"} having too much fun~`);
        }

        setUserVar(msg.author.id, "random_vibe_count", getRandomCount(newintensity));
    }
}

function onRemove (user, intensity) {
    setUserVar(user, "random_vibe_count", 0);
}

exports.choicename = "Random Vibe";
exports.onMessage = onMessage;
exports.onAssign = onAssign;
exports.onRemove = onRemove;