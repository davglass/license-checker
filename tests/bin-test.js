var vows = require('vows'),
    assert = require('assert'),
    path = require('path'),
    spawn = require('child_process').spawn;

var tests = {
    bin: {
        topic: function() {
            var test = this;
            spawn(
              'node', [path.join(__dirname, '../bin/license-checker')], {
                stdio: 'ignore'
              }
            ).on('exit', function(code) {
              test.callback(code === 0);
            });
        },
        'exits with code 0': function(code) {
          assert.ok(code);
        },
    }
};

vows.describe('license-checker').addBatch(tests).export(module);

