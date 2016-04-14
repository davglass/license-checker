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
    
    it('Check for null', function() {
        var data = license('this is empty, hi');
        assert.equal(data, null);
    });
});
