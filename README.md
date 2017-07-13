NPM License Checker
===================


Ever needed to see all the license info for a module and it's dependencies?

It's this easy:

```
npm install -g license-checker

mkdir foo
cd foo
npm install yui-lint
license-checker
```

You should see something like this:

```
├─ cli@0.4.3
│  ├─ repository: http://github.com/chriso/cli
│  └─ licenses: MIT
├─ glob@3.1.14
│  ├─ repository: https://github.com/isaacs/node-glob
│  └─ licenses: UNKNOWN
├─ graceful-fs@1.1.14
│  ├─ repository: https://github.com/isaacs/node-graceful-fs
│  └─ licenses: UNKNOWN
├─ inherits@1.0.0
│  ├─ repository: https://github.com/isaacs/inherits
│  └─ licenses: UNKNOWN
├─ jshint@0.9.1
│  └─ licenses: MIT
├─ lru-cache@1.0.6
│  ├─ repository: https://github.com/isaacs/node-lru-cache
│  └─ licenses: MIT
├─ lru-cache@2.0.4
│  ├─ repository: https://github.com/isaacs/node-lru-cache
│  └─ licenses: MIT
├─ minimatch@0.0.5
│  ├─ repository: https://github.com/isaacs/minimatch
│  └─ licenses: MIT
├─ minimatch@0.2.9
│  ├─ repository: https://github.com/isaacs/minimatch
│  └─ licenses: MIT
├─ sigmund@1.0.0
│  ├─ repository: https://github.com/isaacs/sigmund
│  └─ licenses: UNKNOWN
└─ yui-lint@0.1.1
   ├─ licenses: BSD
      └─ repository: http://github.com/yui/yui-lint
```

An asterisk next to a license name means that it was deduced from
an other file than package.json (README, LICENSE, COPYING, ...)
You could see something like this:

```
└─ debug@2.0.0
   ├─ repository: https://github.com/visionmedia/debug
   └─ licenses: MIT*
```

Options
-------

* `--production` only show production dependencies.
* `--development` only show development dependencies.
* `--unknown` report guessed licenses as unknown licenses.
* `--onlyunknown` only list packages with unknown or guessed licenses.
* `--json` output in json format.
* `--csv` output in csv format.
* `--csvComponentPrefix` prefix column for compoment in csv format.
* `--out [filepath]` write the data to a specific file.
* `--customPath` to add a custom Format file in JSON
* `--exclude [list]` exclude modules which licenses are in the comma-separated list from the output
* `--relativeLicensePath` output the location of the license files as relative paths

Exclusions
----------
A list of licenses is the simples way to describe what you want to exclude.

You can use valid [SPDX identifiers](https://spdx.org/licenses/). 
You can use valid SPDX expressions like `MIT OR X11`.
You can use non-valid SPDX identifiers, like `Public Domain`, since `npm` does
support some license strings that are not SPDX identifiers.

Examples
--------

```
license-checker --json > /path/to/licenses.json
license-checker --csv --out /path/to/licenses.csv
license-checker --unknown
license-checker --customPath customFormatExample.json
license-checker --exclude 'MIT, MIT OR X11, BSD, ISC'
license-checker --onlyunknown
```

Custom format
-------------

The `--customPath` option can be used with CSV to specify the columns. Note that
the first column, `module_name`, will always be used.

When used with JSON format, it will add the specified items to the usual ones.

The available items are the following:
- name
- version
- description
- repository
- publisher
- email
- url
- licenses
- licenseFile
- licenseText
- licenseModified

You can also give default values for each item.
See an example in [customFormatExample.json](customFormatExample.json).

Requiring
---------


```js
var checker = require('license-checker');

checker.init({
    start: '/path/to/start/looking'
}, function(err, json) {
    if (err) {
        //Handle error
    } else {
        //The sorted json data
    }
});
```

Debugging
---------

license-checker uses [debug](https://www.npmjs.com/package/debug) for internal logging. There’s two internal markers:

* `license-checker:error` for errors
* `license-checker:log` for non-errors

Set the `DEBUG` environment variable to one of these to see debug output:

```shell
$ export DEBUG=license-checker*; license-checker
scanning ./yui-lint
├─ cli@0.4.3
│  ├─ repository: http://github.com/chriso/cli
│  └─ licenses: MIT
# ...
```

build status
------------

[![Build Status](https://travis-ci.org/davglass/license-checker.png?branch=master)](https://travis-ci.org/davglass/license-checker)
