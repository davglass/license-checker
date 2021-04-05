var assert = require('assert'),
    path = require('path'),
    spawn = require('child_process').spawn;

describe('failOnCopyleft', function() {
    this.timeout(8000);

    it('should exit 1 if it finds forbidden license due to --failOnCopyleft', function(done) {
        spawn('node', [path.join(__dirname, '../bin/license-checker'), '--failOnCopyleft'], {
            cwd: path.join(__dirname, './fixtures/copyleftProject'),
            stdio: 'ignore'
        }).on('exit', function(code) {
            assert.equal(code, 1);
            done();
        });
    });
});
