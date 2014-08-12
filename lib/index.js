
/*
Copyright (c) 2013, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/

var UNKNOWN = 'UNKNOWN';
var data = {};
var fs = require('fs');
var path = require('path');
var read = require('read-installed');
var treeify = require('treeify');
var license = require('./license');

var flatten = function(json) {
    var moduleInfo = {licenses: UNKNOWN},
        licenseData, files, licenseFile;

    data[json.name + '@' + json.version] = moduleInfo;

    if (json.repository) {
        if (typeof json.repository === 'object' && typeof json.repository.url === 'string') {
            moduleInfo.repository = json.repository.url.replace('git://github.com', 'https://github.com').replace('.git', '');
            moduleInfo.repository = json.repository.url.replace('git@github.com:', 'https://github.com/').replace('.git', '');
        }
    }
    if (json.url) {
        if (typeof json.url === 'object') {
            moduleInfo.url = json.url.web;
        }
    }

    licenseData = json.license || json.licenses || undefined;
    if (licenseData) {
        if (Array.isArray(licenseData) && licenseData.length > 0) {
            moduleInfo.licenses = licenseData.map(function(license){
                if (typeof license === 'object') {
                    return license.type;
                } else if (typeof license === 'string') {
                    return license;
                }
            });
        } else if (typeof licenseData === 'object' && licenseData.type) {
            moduleInfo.licenses = licenseData.type;
        } else if (typeof licenseData === 'string') {
            moduleInfo.licenses = licenseData;
        }
    } else if (license(json.readme)) {
        moduleInfo.licenses = license(json.readme);
    } else {
        files = fs.readdirSync(json.path).filter(function(filename) {
            filename = filename.toUpperCase();
            return filename.indexOf('LICENSE') > -1 || filename.indexOf('LICENCE') > -1 ;
        });

        files.forEach(function(filename) {
            licenseFile = path.join(json.path, filename);
            // Checking that the file is in fact a normal file and not a directory for example.
            if (fs.lstatSync(licenseFile).isFile()) {
                moduleInfo.licenses = license(fs.readFileSync(licenseFile, {encoding: 'utf8'}));
            }
        });
    }

    if (Array.isArray(moduleInfo.licenses)) {
        if (moduleInfo.licenses.length === 1) {
            moduleInfo.licenses = moduleInfo.licenses[0];
        }
    }

    if (json.dependencies) {
        Object.keys(json.dependencies).forEach(function(name) {
            var childDependency = json.dependencies[name],
                dependencyId = childDependency.name + '@' + childDependency.version;
            if (data[dependencyId]) { // already exists
                return;
            }
            flatten(childDependency);
        });
    }
};

exports.init = function(options, callback) {

    console.log('scanning' , options.start);

    read(options.start, function(err, json) {
        flatten(json);
        var sorted = {};
        Object.keys(data).sort().forEach(function(item) {
            if (options.unknown) {
                if (data[item].licenses !== UNKNOWN) {
                    if (data[item].licenses.indexOf('*') === -1) {
                        delete data[item];
                    }
                }
            }
            if (data[item]) {
                sorted[item] = data[item];
            }
        });
        callback(sorted);
    });
};

exports.print = function(sorted) {
    console.log(treeify.asTree(sorted, true));
};

exports.asCSV = function(sorted) {
    var text = [['"module name"','"license"','"repository"'].join(',')];
    Object.keys(sorted).forEach(function(key) {
        var module = sorted[key],
            line = [
                '"' + key + '"',
                '"' + (module.licenses || '') + '"',
                '"' + (module.repository || '') + '"'
            ].join(',');
            text.push(line);
    });

    return text.join('\n');
};
