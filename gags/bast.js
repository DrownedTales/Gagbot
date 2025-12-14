const garbleText = (text, intensity) => {
    let newtextparts = text.split(" ");
    let outtext = '';
    for (let i = 0; i < newtextparts.length; i++) {
        if (Math.random() > (0.50 - (0.05 * intensity))) {

            outtext = `${outtext} `

            var rng = Math.random();

            if (rng > 0.75) {
                outtext = replacer(outtext, newtextparts[i], "ny", "a", "h")
            } else if (rng > 0.5) {
                outtext = replacer(outtext, newtextparts[i], "me", "o", "w")
            } else if (rng > 0.25) {
                outtext = replacer(outtext, newtextparts[i], "pu", "r", "")
            } else {
                outtext = replacer(outtext, newtextparts[i], "g", "r", "")
            }

        }
        else {
            outtext = `${outtext} ${newtextparts[i]}`
        }
    }
    return outtext
}

function replacer(text, ogText, startWord, repeatWord, endWord) {
    for (let t = 0; t < ogText.length; t++) {
        let repletter;
        if (t < startWord.length) { repletter = startWord[t] }
        else if ((t >= (ogText.length-endWord.length)) && ogText.length > startWord.length + endWord.length)  {repletter = endWord[t+endWord.length-ogText.length] }
        else { repletter = repeatWord }
        if (!ogText.charAt(t).search(/[A-z]|\d]/)) {
            if (!ogText.charAt(t).search(/[A-Z]/)) { repletter = repletter.toUpperCase() }
            console.log(repletter);
            text = `${text}${repletter}`
        }
        else {
            text = `${text}${ogText.charAt(t)}`
        }
    }
    return text;
}


exports.garbleText = garbleText;
exports.choicename = "Bast Gag"