const fs = require('fs');
const path = require('path');
const https = require('https');

const assignCorset = (user, tightness) => {
    if (process.corset == undefined) { process.corset = {} }
    process.corset[user] = {
        tightness: tightness ? tightness : 5
    }
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/corsetusers.txt`, JSON.stringify(process.corset));
}

const getCorset = (user) => {
    if (process.corset == undefined) { process.corset = {} }
    return process.corset[user];
}

const removeCorset = (user) => {
    if (process.corset == undefined) { process.corset = {} }
    delete process.corset[user];
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/corsetusers.txt`, JSON.stringify(process.corset));
}

// Takes a wordcountremaining and outputs text 
const corsetLimitWords = (user, text, wordcountremaining) => {
    let tinysound = getCorset(user).tightness >= 7 ? "\n-# " : "";
    if (text.match("-# ")) {
        wordcountremaining = wordcountremaining + 3; // Reward the bottom for making themselves whisper
    }
    else if (text.match("# ")) {
        wordcountremaining = wordcountremaining - 2; // Bad bottom for shouting! Corsets should make you SILENT
    }
    let counter = 0; 
    let wordsinmessage = text.split(" ");
    let newwordsinmessage = [];
    for (let i = 0; i < wordsinmessage.length; i++) {
        if (wordsinmessage[i].length == 0) {
            wordcountremaining++; // add one for 0 length strings, so these are net zero in word count penalty
        }
        newwordsinmessage.push(wordsinmessage[i])
    }
    newwordsinmessage = newwordsinmessage.splice(0, Math.min(newwordsinmessage.length, wordcountremaining));
    wordcountremaining = wordcountremaining - newwordsinmessage.length
    let outtextbefore = newwordsinmessage.join(" ")
    if (getCorset(user).tightness >= 7) {
        outtextbefore = outtextbefore.replace("-#", "") // Replace other instances of small speak so we only have one. 
    }
    let outtext = `${tinysound}${outtextbefore}`
    return outtext
}

exports.assignCorset = assignCorset
exports.getCorset = getCorset
exports.removeCorset = removeCorset
exports.corsetLimitWords = corsetLimitWords;