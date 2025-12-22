
const { stutterText } = require("../functions/vibefunctions.js");

function customStutter(text, intensity) {
    return stutterText(text, intensity).toUpperCase();
}


exports.choicename = "Wand Vibrator";
exports.customStutter = customStutter;
exports.stutterPriority = 2;