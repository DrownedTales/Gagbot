const garbleText = (text) => {
    let newtextparts = text.split(" ");
    let outtext = '';
    for (let i = 0; i < newtextparts.length; i++) {
        let newtext = newtextparts[i].replace("no", "nyo");
        newtext = newtext.replace("na", "nya");
        newtext = newtext.replace("No", "Nyo");
        newtext = newtext.replace("Na", "Nya");
        newtext = newtext.replace("NO", "NYO");
        newtext = newtext.replace("NA", "NYA");
        if (Math.random() < 0.4) {
            outtext = `${outtext}${newtext} Nya `
        }
        else {
            `${outtext}${newtext} `
        }
    }
    return outtext
}

exports.garbleText = garbleText;
exports.choicename = "Kitty Gag"