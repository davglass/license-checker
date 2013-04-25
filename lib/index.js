
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
var _ = require('underscore');

var flatten = function(json, options) {
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
        if (Array.isArray(licenseData) && licenseData.length > 0) {
            moduleInfo.licenses = licenseData.map(function(license){
                if (typeof license === 'object') {
                    return license.type
                } else if (typeof license === 'string') {
                    return license;
                }
            });
        } else if (typeof licenseData === 'object' && licenseData.type) {
            moduleInfo.licenses = licenseData.type;
        } else if (typeof licenseData === 'string') {
            moduleInfo.licenses = licenseData;
        }
    } else if (json.readme){
        moduleInfo.licenses = license(json.readme) || UNKNOWN;
    } 
    if (json.dependencies) {
        if (typeof options.depth === 'number' && options.depth === 0){
            return;
        }
        options.depth--;
        Object.keys(json.dependencies).forEach(function(name) {
            var childDependency = json.dependencies[name];
            var dependencyId = childDependency.name + '@' + childDependency.version;
            if (data[dependencyId]) { // already exists
                return;
            }
            flatten(childDependency, options);
        });
    }
};

exports.init = function(options, callback) {

    var defaults = {
        start: '.',
        unknown: false,
        depth: null, 
    };

    options = _.extend(defaults, options);

    console.log('scanning', options.start);

    read(options.start, function(err, json) {
        flatten(json, options);
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
