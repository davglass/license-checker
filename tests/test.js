var vows = require('vows'),
    assert = require('assert'),
    checker = require('../lib/index');

var tests = {
    loading: {
        topic: function() {
            return checker;
        },
        'should load init': function(topic) {
            assert.isFunction(topic.init);
        },
        'should load print': function(topic) {
            assert.isFunction(topic.print);
        }
    }
};



vows.describe('license-checker').addBatch(tests).export(module);
