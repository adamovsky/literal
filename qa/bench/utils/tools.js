"use strict";

module.exports = {

    writeResults: function writeResults(json) {
        fs.writeFile("./baselines/modules/common/findType.json", JSON.stringify(json, "", 2), function(err) {
            if (err) return console.log(err);
            console.log('Saved json for ' + name);
        });
    }

};