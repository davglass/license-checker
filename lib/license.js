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

var spdx = require('spdx-license-list/spdx-full');
var cmp = require('leven');

var licenses = Object.keys(spdx).map(function(license) {
    obj = spdx[license];
    obj.name = license;
    return obj;
})

function bestMatch(str, filter) {
    var tests = licenses;
    if (filter) {
        filter = filter.toLowerCase();
        tests = licenses.filter(function(a) {
            return a.name.toLowerCase().indexOf(filter) > -1;
        })
        console.log('filter', tests.map(function(a) { return a.name }));
    }

    var results = tests.map(function(license) {
        if (license.license.length * 2 < str) {
            return [license.name, Infinity]
        }

        return [license.name, cmp(str, license.license)]
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

    if (str) {
        str = str.replace('\n', '');
    }

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
    }

    var results = bestMatch(str, filter);

    console.log('----------------------------');
    console.log(results[0][0]);
    console.log(str);

    return results[0][0];
};
