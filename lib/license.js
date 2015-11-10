var MIT_LICENSE = /ermission is hereby granted, free of charge, to any/i;
var BSD_LICENSE = /edistribution and use in source and binary forms, with or withou/i;
var WTFPL_LICENSE = /DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE/i;
var ISC_LICENSE = /The ISC License/i;
var APACHE_LICENSE = /Apache License/i;
var MIT = /MIT\b/;
var BSD = /BSD\b/;
var ISC = /ISC\b/;
var APACHE = /Apache\b/;
var WTFPL = /WTFPL\b/;
var allNewlines = /\r?\n/g;

var spdx = require('spdx-license-list/spdx-full');
var cmp = require('leven');

var licenses = Object.keys(spdx).map(function(name) {
    license = spdx[name];
    if (!license.osiApproved) {
        return false;
    }

    license.name = name;
    return license;
}).filter(Boolean)

function bestMatch(str, filter) {
    var tests = licenses;
    if (filter) {
        filter = filter.toLowerCase();
        tests = licenses.filter(function(a) {
            return a.name.toLowerCase().indexOf(filter) > -1;
        })
    }

    var results = tests.map(function(license) {
        if (license.license.length * 2 < str) {
            return [license.name, Infinity]
        }
        var dist = cmp(str, license.license);
        return [license.name, dist]
    })

    results.sort(function(a, b) {
        return a[1] - b[1];
    })

    return results;
}

module.exports = function(str) {

    if (!str || str.toLowerCase().indexOf('error:') > -1) {
        return null;
    }

    var filter = null;
    str = str.replace(allNewlines, '');

    // Attempt to setup a fast path to avoid extraneous compares
    if (typeof str === 'undefined' || !str) {
        return null;
    } else if (ISC_LICENSE.test(str)) {
        filter = 'ISC';
    } else if (MIT_LICENSE.test(str)) {
        filter = 'MIT';
    } else if (BSD_LICENSE.test(str)) {
        filter = 'BSD';
    } else if (WTFPL_LICENSE.test(str)) {
        filter = 'WTFPL';
    } else if (APACHE_LICENSE.test(str)) {
        filter = 'Apache';
    } else if (ISC.test(str)) {
        filter = 'ISC';
    } else if (MIT.test(str)) {
        filter = 'MIT';
    } else if (BSD.test(str)) {
        filter = 'BSD';
    } else if (WTFPL.test(str)) {
        filter = 'WTFPL';
    } else if (APACHE.test(str)) {
        filter = 'Apache';
    } else {
        return null
    }

    var results = bestMatch(str, filter);

    return results[0] && results[0][0] || null;
};
