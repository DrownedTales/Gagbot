
const { arousedtexts, arousedtextshigh } = require('./aroused/aroused_texts.js')

function customStutter(text, intensity) {

    var wordlist = text.split(" ");

    let arousedlist = arousedtexts;
    if (intensity > 10) {
        for (let i = 0; i < arousedtextshigh; i++) { // Remove the first 5 elements to give the high arousal texts higher chance to show up
            arousedlist[i] = arousedtextshigh[i]
        }
        if (intensity > 20) {
            arousedlist = arousedlist.map(word => word.toUpperCase()); // All caps if too much intensity
        }
    }

    let randomnumbers = [];
    let sum = 0;
    let i = 0;
    while (sum < wordlist.length) {
        let newnum = Math.max(Math.floor(((Math.random() * 3) + 3) - ((Math.random() * (intensity / 5)) + (intensity / 10))), 1); //Get random intervals, more often with more intensity
        randomnumbers.push(newnum);
        sum += newnum;
        if (i > wordlist.length) {
            break;
        }
        i++;
    }

    let newwordlist = [];
    let j = 0;
    let acum = 0;
    for (let i = 0; i < wordlist.length; i++) {
        if (i - acum == randomnumbers[j]) {
            newwordlist.push(wordlist[i]);
            newwordlist.push(arousedlist[Math.floor(Math.random() * arousedlist.length)]); // Insert arousal text
            acum += randomnumbers[j];
            j++;
        } else {
            newwordlist.push(wordlist[i]);
        }
    }

    return newwordlist.join(" ");
}

exports.choicename = "Auto Thruster";
exports.customStutter = customStutter;
exports.stutterPriority = 5;