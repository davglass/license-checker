/*
Copyright (c) 2013, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/

var UNKNOWN = 'UNKNOWN';
var fs = require('fs');
var path = require('path');
var read = require('read-installed');
var chalk = require('chalk');
var treeify = require('treeify');
var license = require('./license');
var debug = require('debug');

// Set up debug logging
// https://www.npmjs.com/package/debug#stderr-vs-stdout
var debugError = debug('license-checker:error');
var debugLog = debug('license-checker:log');
debugLog.log = console.log.bind(console);

var flatten = function(options) {
    var moduleInfo = { licenses: UNKNOWN },
        json = options.deps,
        data = options.data,
        key = json.name + '@' + json.version,
        colorize = options.color,
        unknown = options.unknown,
        licenseData, files = [], licenseFile;

    /*istanbul ignore next*/
    if (colorize) {
        moduleInfo = { licenses: chalk.bold.red(UNKNOWN) };
        key = chalk.blue(json.name) + chalk.dim('@') + chalk.green(json.version);
    }

    // If we have processed this key already, just return the data object.
    // This was added so that we don't recurse forever if there was a circular
    // dependency in the dependency tree.
    /*istanbul ignore next*/
    if (data[key]) {
        return data;
    }

    if ((options.production && json.extraneous) || (options.development && !json.extraneous && !json.root)) {
        return data;
    }

    data[key] = moduleInfo;

    if (json.repository) {
        /*istanbul ignore else*/
        if (typeof json.repository === 'object' && typeof json.repository.url === 'string') {
            moduleInfo.repository = json.repository.url.replace('git+ssh://git@', 'git://').replace('.git', '');
            moduleInfo.repository = moduleInfo.repository.replace('git://github.com', 'https://github.com').replace('.git', '');
            moduleInfo.repository = moduleInfo.repository.replace('git@github.com:', 'https://github.com/').replace('.git', '');
        }
    }
    if (json.url) {
        /*istanbul ignore next*/
        if (typeof json.url === 'object') {
            moduleInfo.url = json.url.web;
        }
    }

    /*istanbul ignore next*/
    if (unknown) {
        moduleInfo.dependencyPath = json.path;
    }

    /*istanbul ignore next*/
    if (options.customFormat) {
        Object.keys(options.customFormat).forEach(function forEachCallback(item) {
            if (json[item]) {
                //For now, we only support strings, not JSON objects
                if (typeof json[item] === 'string') {
                    moduleInfo[item] = json[item];
                }
            } else {
                moduleInfo[item] = options.customFormat[item];
            }
        });
    }

    licenseData = json.license || json.licenses || undefined;
    if (licenseData) {
        /*istanbul ignore else*/
        if (Array.isArray(licenseData) && licenseData.length > 0) {
            moduleInfo.licenses = licenseData.map(function(license){
                /*istanbul ignore else*/
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
    }

    /*istanbul ignore else*/
    if (json.path && fs.existsSync(json.path)) {
        files = fs.readdirSync(json.path).filter(function(filename) {
            filename = filename.toUpperCase();
            return filename.indexOf('LICENSE') > -1 || filename.indexOf('LICENCE') > -1 ;
        });
    }

    files.forEach(function(filename) {
        licenseFile = path.join(json.path, filename);
        // Checking that the file is in fact a normal file and not a directory for example.
        /*istanbul ignore else*/
        if (fs.lstatSync(licenseFile).isFile()) {
            if (!moduleInfo.licenses || moduleInfo.licenses.indexOf(UNKNOWN) > -1) {
                //Only re-check the license if we didn't get it from elsewhere
                moduleInfo.licenses = license(fs.readFileSync(licenseFile, {encoding: 'utf8'}));
            }
            moduleInfo.licenseFile = licenseFile;
        }
    });

    if (Array.isArray(moduleInfo.licenses)) {
        /*istanbul ignore else*/
        if (moduleInfo.licenses.length === 1) {
            moduleInfo.licenses = moduleInfo.licenses[0];
        }
    }

    /*istanbul ignore else*/
    if (json.dependencies) {
        Object.keys(json.dependencies).forEach(function(name) {
            var childDependency = json.dependencies[name],
            dependencyId = childDependency.name + '@' + childDependency.version;
            if (data[dependencyId]) { // already exists
                return;
            }
            data = flatten({
                deps: childDependency,
                data: data,
                color: colorize,
                unknown: unknown,
                customFormat: options.customFormat,
                production: options.production,
                development: options.development
            });
        });
    }
    return data;
};

exports.init = function(options, callback) {
    debugLog('scanning %s', options.start);

    if (options.customPath) {
        options.customFormat = this.parseJson(options.customPath);
    }
    var opts = {
        dev: true,
        log: debugLog
    };

    if (options.production || options.development) {
        opts.dev = false;
    }

    read(options.start, opts, function(err, json) {
        var data = flatten({
                deps: json,
                data: {},
                color: options.color,
                unknown: options.unknown,
                customFormat: options.customFormat,
                production: options.production,
                development: options.development
            }),
            colorize = options.color,
            sorted = {},
            filtered = {},
            exclude = options.exclude && options.exclude.replace(/^\s+|\s+$/g, '').split(/\s*,\s*/),
            inputError = null;

        Object.keys(data).sort().forEach(function(item) {
            if (!data[item].licenses) {
                /*istanbul ignore else*/
                if (colorize) {
                    data[item].licenses = chalk.bold.red(UNKNOWN);
                } else {
                    data[item].licenses = UNKNOWN;
                }
            }
            if (options.unknown) {
                if (data[item].licenses && data[item].licenses !== UNKNOWN) {
                    if (data[item].licenses.indexOf('*') > -1) {
                        /*istanbul ignore if*/
                        if (colorize) {
                            data[item].licenses = chalk.bold.red(UNKNOWN);
                        } else {
                            data[item].licenses = UNKNOWN;
                        }
                    }
                }
            }
            /*istanbul ignore else*/
            if (data[item]) {
                if (options.onlyunknown) {
                    if (data[item].licenses.indexOf('*') > -1 ||
                        data[item].licenses.indexOf('UNKNOWN') > -1) {
                        sorted[item] = data[item];
                    }
                } else {
                    sorted[item] = data[item];
                }
            }
        });
        if (exclude) {
            Object.keys(sorted).forEach(function(item) {
                if (!(sorted[item].licenses && exclude.indexOf(sorted[item].licenses) !== -1)) {
                    filtered[item] = sorted[item];
                }
            });
        } else {
            filtered = sorted;
        }

        /*istanbul ignore next*/
        if (err) {
            debugError(err);
            inputError = err;
        }

        //Initiate an error if needed (e.g. something awful happaned)
        if (inputError === null && Object.keys(sorted).length === 1) {
            Object.keys(sorted).forEach(function forEachCallback(item) {
                var tempItem = chalk.stripColor(item);
                if (tempItem === 'undefined@undefined') {
                    inputError = new Error('No Npm Packages Found');
                }
            });
        }

        //Return the callback and variables nicely
        callback(filtered, inputError);
    });
};

/*istanbul ignore next*/
exports.print = function(sorted) {
    console.log(exports.asTree(sorted));
};

exports.asTree = function(sorted) {
    return treeify.asTree(sorted, true);
};

exports.asCSV = function(sorted, customFormat) {
    var text = [ ], textArr = [ ], lineArr = [ ];

    if (customFormat && Object.keys(customFormat).length > 0) {
        textArr = [ ];
        textArr.push('"module name"');
        Object.keys(customFormat).forEach(function forEachCallback(item) {
            textArr.push('"' + item + '"');
        });
        text.push(textArr.join(','));
    } else {
        text.push(['"module name"','"license"','"repository"'].join(','));
    }

    Object.keys(sorted).forEach(function(key) {
        var module = sorted[key],
        line = '';
        lineArr = [ ];

        //Grab the custom keys from the custom format
        if (customFormat && Object.keys(customFormat).length > 0) {
            lineArr.push('"' + key + '"');
            Object.keys(customFormat).forEach(function forEachCallback(item) {
                lineArr.push('"' + module[item] + '"');
            });
            line = lineArr.join(',');
        } else {
            line = [
                '"' + key + '"',
                '"' + (module.licenses || '') + '"',
                '"' + (module.repository || '') + '"'
            ].join(',');
        }
        text.push(line);
    });

    return text.join('\n');
};

/**
* Exports data as markdown (*.md) file which has it's own syntax.
* @method
* @param  {JSON} sorted       The sorted JSON data from all packages.
* @param  {JSON} customFormat The custom format with information about the needed keys.
* @return {String}            The returning plain text.
*/
exports.asMarkDown = function(sorted, customFormat) {

    var text = [];
    if (customFormat && Object.keys(customFormat).length > 0) {
        Object.keys(sorted).forEach(function sortedCallback(sortedItem) {
            text.push(' - **[' + sortedItem + '](' + sorted[sortedItem].repository + ')**');
            Object.keys(customFormat).forEach(function customCallback(customItem) {
                text.push('    - ' +  customItem + ': ' + sorted[sortedItem][customItem]);
            });
        });
        text = text.join('\n');
    } else {
        Object.keys(sorted).forEach(function(key) {
            var module = sorted[key];
            text.push('[' + key + '](' + module.repository + ') - ' + module.licenses);
        });
        text = text.join('\n');
    }

    return text;
};

/*istanbul ignore next*/
exports.parseJson = function(jsonPath) {
    if (typeof jsonPath !== 'string') {
        return new Error('did not specify a path');
    }

    var jsonFileContents = '',
        result = { };

    try {
        jsonFileContents = fs.readFileSync(jsonPath, {encoding: 'utf8'});
        result = JSON.parse(jsonFileContents);
    } catch (err) {
        result = err;
    } finally {
      return result;
    }
};
