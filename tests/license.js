var vows = require('vows'),
    assert = require('assert'),
    license = require('../lib/license');

var tests = {
    loading: {
        topic: function() {
            return license;
        },
        'should be a function': function(topic) {
            assert.isFunction(topic);
        }
    },
    'undefined check': {
        topic: function() {
            return license(undefined);
        },
        'should return Undefined': function(data) {
            assert.equal(data, 'Undefined');
        }
    },
    'MIT check': {
        topic: function() {
            return license('asdf\nasdf\nasdf\nPermission is hereby granted, free of charge, to any');
        },
        'should return MIT': function(data) {
            assert.equal(data, 'MIT*');
        }
    },
    'MIT word check': {
        topic: function() {
            return license('asdf\nasdf\nMIT\nasdf\n');
        },
        'should return MIT': function(data) {
            assert.equal(data, 'MIT*');
        }
    },
    'BSD check': {
        topic: function() {
            return license('asdf\nRedistribution and use in source and binary forms, with or without\nasdf\n');
        },
        'should return BSD': function(data) {
            assert.equal(data, 'BSD*');
        }
    },
    'BSD word check': {
        topic: function() {
            return license('asdf\nasdf\nBSD\nasdf\n');
        },
        'should return BSD': function(data) {
            assert.equal(data, 'BSD*');
        }
    },
    'Apache word check': {
        topic: function() {
            return license('asdf\nasdf\nApache License\nasdf\n');
        },
        'should return Apache': function(data) {
            assert.equal(data, 'Apache*');
        }
    },
    'WTF check': {
        topic: function() {
            return license('DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE');
        },
        'should return WTF': function(data) {
            assert.equal(data, 'WTF*');
        }
    }
};

vows.describe('licenses').addBatch(tests).export(module);
