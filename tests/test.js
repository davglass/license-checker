var vows = require('vows'),
    assert = require('assert'),
    path = require('path'),
    checker = require('../lib/index'),
    args = require('../lib/args'),
    fs = require('fs');

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
            assert.equal(d['abbrev@1.0.7'].licenses, 'ISC');
        },
        'and convert to CSV': function(d) {
            var str = checker.asCSV(d);
            assert.equal('"module name","license","repository"', str.split('\n')[0]);
            assert.equal('"abbrev@1.0.7","ISC","https://github.com/isaacs/abbrev-js"', str.split('\n')[1]);
        },
        'and convert to MarkDown': function(d) {
            var str = checker.asMarkDown(d);
            assert.equal('[abbrev@1.0.7](https://github.com/isaacs/abbrev-js) - ISC', str.split('\n')[0]);
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
                assert.ok(d);
                assert.ok(d['vows@0.8.0'], 'failed to lookup vows dep');
                assert.equal(d['vows@0.8.0'].licenses, 'MIT');
                assert.isTrue(Object.keys(d).length > 20);
            }
        }
    },
    'should parse local with unknown and excludes': {
        topic: function () {
            var self = this;

            checker.init({
                start: path.join(__dirname, '../'),
                exclude: "MIT, ISC"
            }, function (filtered) {
                self.callback(null, filtered);
            });
        },
        'and exclude MIT and ISC licensed modules from results': function (d) {
            var excluded = true;
            Object.keys(d).forEach(function(item) {
                if (d[item].licenses && (d[item].licenses == "MIT" || d[item].licenses == "ISC"))
                    excluded = false;
            })
            assert.ok(excluded);
        }
    },
    'should not error': {
        topic: function () {
            var lic = require('../lib/license.js');
            return lic();
        },
        'on undefined': function (d) {
            assert.equal(d, 'Undefined');
        }
    },
    'should create a custom format using customFormat': {
        topic: function () {
            var self = this;

            checker.init({
                start: path.join(__dirname, '../'),
                exclude: "MIT, ISC",
                customFormat: {
                    'name': '<<Default Name>>',
                    'description': '<<Default Description>>',
                    'pewpew': '<<Should Never be set>>'
                }
            }, function (filtered) {
                self.callback(null, filtered);
            });
        },
        'create custom format with name, description and pewpew (customFormat manipulation)': function (d) {
            Object.keys(d).forEach(function(item) {
                assert.notEqual(d[item].name, undefined);
                assert.notEqual(d[item].description, undefined);
                assert.notEqual(d[item].pewpew, undefined);
                assert.equal(d[item].pewpew, '<<Should Never be set>>');
            });
        }
    },
    'should create a custom format using customPath': {
        topic: function () {
            var self = this;

            process.argv.push('--customPath');
            process.argv.push('./customFormatExample.json');

            args = args.parse();
            args.start = path.join(__dirname, '../');

            process.argv.pop();
            process.argv.pop();

            checker.init(args, function (filtered) {
                self.callback(null, filtered);
            });
        },
        'create custom format with contents of customFormatExample': function (d) {
            var customFormatContent = fs.readFileSync(path.join(__dirname, './../customFormatExample.json'), 'utf8');

            assert.notEqual(customFormatContent, undefined);
            assert.notEqual(customFormatContent, null);

            var customJson = JSON.parse(customFormatContent);

            //Test dynamically with the file directly
            Object.keys(d).forEach(function(licenseItem) {
                Object.keys(customJson).forEach(function(definedItem) {
                    assert.notEqual(d[licenseItem][definedItem], undefined);
                });
            });
        }
    }

            checker.init({
                start: path.join(__dirname, '../'),
                onlyunknown: true
            }, function (sorted) {
                self.callback(null, sorted);
            });
        },
        'so we check if there is no license with a star or UNKNOWN found': function(d) {
            var onlyStarsFound = true;
            Object.keys(d).forEach(function(item) {
                if (d[item].licenses && d[item].licenses.indexOf('UNKNOWN') !== -1) {
                    //Okay
                } else if (d[item].licenses && d[item].licenses.indexOf('*') !== -1) {
                    //Okay
                } else {
                    onlyStarsFound = false;
                }
            });

            assert.ok(onlyStarsFound);
        }
    },
    'should only list UNKNOWN or guessed licenses with errors (argument missing)': {
        topic: function () {
            var self = this;

            checker.init({
                start: path.join(__dirname, '../')
            }, function (sorted) {
                self.callback(null, sorted);
            });
        },
        'so we check if there is no license with a star or UNKNOWN found': function(d) {
            var onlyStarsFound = true;
            Object.keys(d).forEach(function(item) {
                if (d[item].licenses && d[item].licenses.indexOf('UNKNOWN') !== -1) {
                    //Okay
                } else if (d[item].licenses && d[item].licenses.indexOf('*') !== -1) {
                    //Okay
                } else {
                    onlyStarsFound = false;
                }
            });
            assert.equal(onlyStarsFound, false);
        }
    },
    'should export a tree': {
        topic: function() {
            return checker.asTree([{}]);
        },
        'and format it': function(data) {
            assert.ok(data);
            assert.isTrue(data.indexOf('└─') > -1);
        }
    },
    'should export as csv': {
        topic: function() {
            return checker.asCSV({
                foo: {
                    licenses: 'MIT',
                    repository: '/path/to/foo'
                }   
            });
        },
        'and format it': function(data) {
            assert.ok(data);
            assert.isTrue(data.indexOf('"foo","MIT","/path/to/foo"') > -1);
        }
    },
    'should export as csv with partial data': {
        topic: function() {
            return checker.asCSV({
                foo: {
                }   
            });
        },
        'and format it': function(data) {
            assert.ok(data);
            assert.isTrue(data.indexOf('"foo","",""') > -1);
        }
    },
    'should export as markdown': {
        topic: function() {
            return checker.asMarkDown({
                foo: {
                    licenses: 'MIT',
                    repository: '/path/to/foo'
                }   
            });
        },
        'and format it': function(data) {
            assert.ok(data);
            assert.isTrue(data.indexOf('[foo](/path/to/foo) - MIT') > -1);
        }
    },
};

vows.describe('license-checker').addBatch(tests).export(module);
