// We were originally going to install Moment, but frankly, since I just need to try to do a basic time parse, we're going to write our own. 

// Takes input string, outputs a date object. 
const parseTime = (text) => {
    try {
        let t = text.toLowerCase();

        let num = (regex) => {
            const m = t.match(regex);
            return m ? parseInt(m[1], 10) : 0;
        };

        let days    = num(/(\d+)\s*d(?:ay|ays)?/);
        let hours   = num(/(\d+)\s*h(?:our|rs?)?/);
        let minutes = num(/(\d+)\s*m(?:in|ins?)?/);
        let seconds = num(/(\d+)\s*s(?:ec|ecs?)?/);

        // Create date output
        let dateout = new Date();
        // add days
        dateout.setTime(dateout.getTime() + days * 24 * 60 * 60 * 1000);
        // add hours
        dateout.setTime(dateout.getTime() + hours * 60 * 60 * 1000);
        // add minutes
        dateout.setTime(dateout.getTime() + minutes * 60 * 1000);
        // add seconds
        dateout.setTime(dateout.getTime() + seconds * 1000);

        return dateout
    }
    catch (err) {
        return new Date;
    }
}

// Takes string input, returns an integer with number of ms for the setTimeout function
const calculateTimeout = (text) => {
    try {
        return (parseTime(text) - (new Date));
    }
    catch (err) {
        return 0;
    }
}



exports.parseTime = parseTime;
exports.calculateTimeout = calculateTimeout;