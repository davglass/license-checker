NPM License Checker
===================


Ever needed to see all the license info for a module and it's dependencies?

It's this easy:

```
npm -g license-checker

mkdir foo
cd foo
npm install yui-lint
license-checker
```

You should see something like this:

```
scanning ./yui-lint
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

You can also specify `--unknown` to only show licenses that it can't determine or guessed at (from README)

Also supports `--json /path/to/save.json` to export the data.

Requiring
---------


```javascript
var checker = require('license-checker');

checker.init({
    start: '/path/to/start/looking'
}, function(json) {
    //The sorted json data
});

```

### Options (Defaults)
Below are the list of defaults and their descriptions.
You may pass them either as a module or through the command line (ie. `license-checker --depth=3`)

```javascript
{
  unknown: false,    // Boolean: generate only a list of unknown licenses
  start: '.',        // String: path to start the dependency checks
  depth: null,       // Number: how deep to recurse through the dependencies
}
```
