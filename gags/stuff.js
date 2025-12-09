const garbleText = (text) => {
    let newtextparts = text.split(" ");
    let outtext = '';
    for (let i = 0; i < newtextparts.length; i++) {
        let randomlength = newtextparts[i].length + 3 - (6 * Math.random())
        for (let t = 0; t < randomlength - 2; t++) {
            if (t == 0) {
                outtext = `${outtext}M`
            }
            else {
                outtext = `${outtext}m`
            }
        }
        outtext = `${outtext}ph `
    }
    return outtext
}

exports.garbleText = garbleText;
exports.choicename = "Stuff Gag"