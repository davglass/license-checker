var vows = require('vows'),
    assert = require('assert'),
    path = require('path'),
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
    },
    'should parse local with unknown': {
        topic: function () {
            var self = this;

            checker.init({
                start: path.join(__dirname, '../')
            }, function (sorted) {
                self.callback(null, sorted);
            });
        },
        'and give us results': function (d) {
            assert.isTrue(Object.keys(d).length > 70);
            assert.equal(d['abbrev@1.0.4'].licenses, 'MIT');
        },
        'should parse local without unknown': {
            topic: function () {
                var self = this;

                checker.init({
                    start: path.join(__dirname, '../'),
                    unknown: true
                }, function (sorted) {
                    self.callback(null, sorted);
                });
            },
            'and give us results': function (d) {
                assert.equal(d['vows@0.7.0'].licenses, 'BSD*');
                assert.isTrue(Object.keys(d).length > 20);
            }
        }
    }
};



vows.describe('license-checker').addBatch(tests).export(module);
