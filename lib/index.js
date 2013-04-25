
/*
Copyright (c) 2013, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/

var UNKNOWN = 'UNKNOWN';
var data = {};
var read = require('read-installed');
var treeify = require('treeify');
var license = require('./license');

var flatten = function(json) {
    var moduleInfo = {licenses: UNKNOWN}
    var moduleId;
    
    data[json.name + '@' + json.version] = moduleInfo;

    if (json.repository) {
        if (typeof json.repository === 'object') {
            moduleInfo.repository = json.repository.url.replace('git://github.com', 'https://github.com').replace('.git', '');
        }
    }
    if (json.url) {
        if (typeof json.url === 'object') {
            moduleInfo.url = json.url.web;
        }
    }
    var licenseData = json.license || json.licenses || undefined;
    if (licenseData) {
        var licenseMap = {};
        if (Array.isArray(licenseData)) {
            licenseData.forEach(function(license) {
                if (typeof license === 'object') {
                    licenseMap[license.type] = license.type;
                } else if (typeof license === 'string') {
                    licenseMap[license] = license;
                }
            });
            if (Object.keys(licenseMap).length > 1) {
                moduleInfo.licenses = Object.keys(licenseMap);
            }
        } else if (typeof licenseData === 'object' && licenseData.type) {
            moduleInfo.licenses = licenseData.type;
        } else if (typeof licenseData === 'string') {
            moduleInfo.licenses = licenseData;
        }
    } else if (json.readme){
        moduleInfo.licenses = license(json.readme) || UNKNOWN;
    } 
    if (json.dependencies) {
        Object.keys(json.dependencies).forEach(function(name) {
            var childDependency = json.dependencies[name];
            var dependencyId = childDependency.name + '@' + childDependency.version;
            if (data[dependencyId]) { // already exists
                return;
            }
            flatten(childDependency);
        });
    }
};

exports.init = function(options, callback) {

    console.log('scanning', options.start);

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
