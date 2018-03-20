var path = require('path');


// Find and list license files in the precedence order
module.exports = function(dirFiles) {
    var files = [];
    ['LICENSE', 'LICENCE', 'COPYING', 'README'].forEach(function(licenseFilename) {
        var found = false;
        dirFiles.forEach(function(filename) {
            if (!found) {
                var basename = path.basename(filename, path.extname(filename)).toUpperCase();
                if (basename === licenseFilename) {
                    files.push(filename);
                    found = true;
                }
            }
        });
    });
    return files;
};
