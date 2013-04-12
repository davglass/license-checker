
/*
Copyright (c) 2013, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/

var UNKNOWN = 'UNKNOWN';
var data = {};
var read = require('read-installed');
var treeify = require('treeify');

var parseReadMe = function(str) {
    
    if (str.indexOf('MIT') > -1) {
        str = 'MIT*';
    } else if (str.indexOf('BSD') > -1) {
        str = 'BSD*';
    } else if (str.indexOf('Apache License') > -1) {
        str = 'Apache*';
    } else if (str.indexOf('DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE') > -1) {
        str = 'WTF*';
    } else {
        str = UNKNOWN;
    }

    return str;
};

var flatten = function(json) {
    
    Object.keys(json).forEach(function(item) {
        switch (item) {
            case 'repository':
                if (typeof json[item] === 'object') {
                    json[item] = json[item].url.replace('git://github.com', 'https://github.com').replace('.git', '');
                }
                break;
            case 'url':
                if (typeof json[item] === 'object') {
                    json[item] = json[item].web;
                }
                if (json.repository) {
                    delete json[item];
                }
                break;
            case 'name':
            case 'version':
                break;
            case 'readme':
                if (json[item]) {
                    if (!json.licence && !json.licenses) {
                        json.licenses = parseReadMe(json[item]);
                    }
                    if (json.licenses === UNKNOWN) {
                        json.licenses = parseReadMe(json[item]);
                    }
                    delete json[item];
                }
                break;
            case 'license':
            case 'licenses':
                var i = {}, t = 'licenses';
                if (Array.isArray(json[item])) {
                    json[item].forEach(function(o) {
                        if (typeof o === 'object') {
                            i[o.type] = o.type;
                        } else {
                            i[o] = o;
                        }
                    });
                    if (Object.keys(i).length > 1) {
                        json[t] = Object.keys(i);
                    } else {
                        json[t] = Object.keys(i)[0];
                    }
                }
                if (typeof json[item] === 'object') {
                    json[t] = json[item].type;
                }
                if (typeof json[item] === 'string') {
                    json[t] = json[item];
                }
                delete json.readme;
                if (item === 'license') {
                    delete json.license;
                }
                break;
            case 'dependencies':
                if (item === 'dependencies') {
                    json.deps = {};
                    Object.keys(json[item]).forEach(function(name) {
                        var j = flatten(json[item][name]);
                        data[j.name + '@' + j.version] = j;
                        json.deps[name] = j;
                        delete j.deps;
                    });
                    delete json[item];
                    if (!Object.keys(json.deps).length) {
                        delete json.deps;
                    }
                }
                break;
            default:
                delete json[item];
                break;
        }
    });
    
    data[json.name + '@' + json.version] = json;
    delete json.deps;
    return json;
};


exports.init = function(options, callback) {
    console.log('scanning', options.start);
    read(options.start, function(err, json) {
        json = flatten(json);
        var sorted = {};
        Object.keys(data).sort().forEach(function(item) {
            delete data[item].name;
            delete data[item].version;
            if (!data[item].licenses) {
                data[item].licenses = UNKNOWN;
            }
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
