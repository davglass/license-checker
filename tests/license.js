var assert = require('assert'),
    license = require('../lib/license');

describe('license parser', function() {

    it('should export a function', function() {
        assert.equal(typeof license, 'function');
    });

    it('undefined check', function() {
        assert.equal(license(undefined), 'Undefined');
    });

    it('MIT check', function() {
        var data = license('asdf\nasdf\nasdf\nPermission is hereby granted, free of charge, to any');
        assert.equal(data, 'MIT*');
    });

    it('MIT word check', function() {
        var data = license('asdf\nasdf\nMIT\nasdf\n');
        assert.equal(data, 'MIT*');
    });

    it('BSD check', function() {
        var data = license('asdf\nRedistribution and use in source and binary forms, with or without\nasdf\n');
        assert.equal(data, 'BSD*');
    });

    it('BSD-Source-Code check', function() {
        var data = license('asdf\nRedistribution and use of this software in source and binary forms, with or without modification, are permitted provided that the following conditions are met:\nasdf\n');
        assert.equal(data, 'BSD-Source-Code*');
    });

    it('BSD word check', function() {
        var data = license('asdf\nasdf\nBSD\nasdf\n');
        assert.equal(data, 'BSD*');
    });

    it('Apache word check', function() {
        var data = license('asdf\nasdf\nApache License\nasdf\n');
        assert.equal(data, 'Apache*');
    });

    it('WTF check', function() {
        var data = license('DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE');
        assert.equal(data, 'WTFPL*');
    });

    it('WTF word check', function() {
        var data = license('asdf\nasdf\nWTFPL\nasdf\n');
        assert.equal(data, 'WTFPL*');
    });

    it('ISC check', function() {
        var data = license('asdfasdf\nThe ISC License\nasdfasdf');
        assert.equal(data, 'ISC*');
    });

    it('ISC word check', function() {
        var data = license('asdf\nasdf\nISC\nasdf\n');
        assert.equal(data, 'ISC*');
    });

    it('CC0-1.0 word check', function() {
        var data = license('The person who associated a work with this deed has dedicated the work to the public domain by waiving all of his or her rights to the work worldwide under copyright law, including all related and neighboring rights, to the extent allowed by law.\n\nYou can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission.\n');
        assert.equal(data, 'CC0-1.0*');
    });

    it('Check for null', function() {
        var data = license('this is empty, hi');
        assert.equal(data, null);
    });
});
