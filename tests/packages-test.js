var assert = require('assert'),
    path = require('path'),
    spawn = require('child_process').spawn,
    restrictedPackages = [
        'readable-stream@1.1.14',
        'spdx-satisfies@4.0.0',
        'y18n@3.2.1',
    ];

describe('bin/license-checker', function() {
    this.timeout(8000);

    it('should restrict the output to the provided packages', function(done) {
        var node = spawn('node', [path.join(__dirname, '../bin/license-checker'), '--json', '--packages', restrictedPackages.join(';')], {
            cwd: path.join(__dirname, '../'),
        });
        
        node.stdout.on('data', function(data) {
            assert.deepEqual(Object.keys(JSON.parse(data.toString())), restrictedPackages);
            done();
        });
    });
});
