var MIT_LICENSE = /ermission is hereby granted, free of charge, to any/;
var BSD_LICENSE = /edistribution and use in source and binary forms, with or withou/;
var BSD_SOURCE_CODE_LICENSE = /edistribution and use of this software in source and binary forms, with or withou/;
var WTFPL_LICENSE = /DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE/;
var ISC_LICENSE = /The ISC License/;
var MIT = /MIT\b/;
var BSD = /BSD\b/;
var ISC = /ISC\b/;
var APACHE = /Apache License\b/;
var WTFPL = /WTFPL\b/;
// https://creativecommons.org/publicdomain/zero/1.0/
var CC0_1_0 = /The\s+person\s+who\s+associated\s+a\s+work\s+with\s+this\s+deed\s+has\s+dedicated\s+the\s+work\s+to\s+the\s+public\s+domain\s+by\s+waiving\s+all\s+of\s+his\s+or\s+her\s+rights\s+to\s+the\s+work\s+worldwide\s+under\s+copyright\s+law,\s+including\s+all\s+related\s+and\s+neighboring\s+rights,\s+to\s+the\s+extent\s+allowed\s+by\s+law.\s+You\s+can\s+copy,\s+modify,\s+distribute\s+and\s+perform\s+the\s+work,\s+even\s+for\s+commercial\s+purposes,\s+all\s+without\s+asking\s+permission./i; // jshint ignore:line


module.exports = function(str) {
    if (str) {
        str = str.replace('\n', '');
    }
    if (typeof str === 'undefined' || !str) {
        return 'Undefined';
    } else if (ISC_LICENSE.test(str)) {
        return 'ISC*';
    } else if (MIT_LICENSE.test(str)) {
        return 'MIT*';
    } else if (BSD_LICENSE.test(str)) {
        return 'BSD*';
    } else if (BSD_SOURCE_CODE_LICENSE.test(str)) {
        // https://spdx.org/licenses/BSD-Source-Code.html
        return 'BSD-Source-Code*';
    } else if (WTFPL_LICENSE.test(str)) {
        return 'WTFPL*';
    } else if (ISC.test(str)) {
        return 'ISC*';
    } else if (MIT.test(str)) {
        return 'MIT*';
    } else if (BSD.test(str)) {
        return 'BSD*';
    } else if (WTFPL.test(str)) {
        return 'WTFPL*';
    } else if (APACHE.test(str)) {
        return 'Apache*';
    } else if (CC0_1_0.test(str)) {
        return 'CC0-1.0*';
    }
    return null;
};
