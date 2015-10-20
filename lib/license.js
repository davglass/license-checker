var MIT_LICENSE = /ermission is hereby granted, free of charge, to any/;
var BSD_LICENSE = /edistribution and use in source and binary forms, with or withou/;
var WTFPL_LICENSE = /DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE/;
var ISC_LICENSE = /The ISC License/;
var MIT = /MIT\b/;
var BSD = /BSD\b/;
var ISC = /ISC\b/;
var APACHE = /Apache License\b/;
var WTFPL = /WTFPL\b/;


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
    }
    return null;
};
