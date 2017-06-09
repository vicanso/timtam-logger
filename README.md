# timtam logger

[![Build Status](https://travis-ci.org/vicanso/timtam-logger.svg?branch=master)](https://travis-ci.org/vicanso/timtam-logger)
[![Coverage Status](https://img.shields.io/coveralls/vicanso/timtam-logger/master.svg?style=flat)](https://coveralls.io/r/vicanso/timtam-logger?branch=master)
[![npm](http://img.shields.io/npm/v/timtam-logger.svg?style=flat-square)](https://www.npmjs.org/package/timtam-logger)
[![Github Releases](https://img.shields.io/npm/dm/timtam-logger.svg?style=flat-square)](https://github.com/vicanso/timtam-logger)

## Installation

```bash
$ npm install timtam-logger
```

## API

### constructor

- `options` The options for logger, default: {"app": "timtam", "timestamp": true, "maxLength": 900, "level": 3}

```js
const Logger = require('timtam-logger');
const logger = new Logger({
  app: 'my-app',
});
```

### set

Set the value for options

- `k` The key of value or data to set

- `v` The value

```js
const Logger = require('timtam-logger');
const logger = new Logger({
  app: 'my-app',
});

logger.set({
  app: 'new-app',
});
logger.set('maxLength', 1000);
```

### add

Add transport for logger

- `type` Transport type or uri for transport

- `opts` The options for transport

```js
const Logger = require('timtam-logger');
const logger = new Logger({
  app: 'my-app',
});

logger.add('udp://127.0.0.1:5001');
logger.add('console');
logger.add('udp', {
  host: '127.0.0.1',
  port: 4012,
});
```

### remove

Remove transport from logger

- `transport` The transport

```js
const Logger = require('timtam-logger');
const logger = new Logger({
  app: 'my-app',
});

const udpTransport = logger.add('udp://127.0.0.1:5001');
logger.remove(udpTransport);
logger.add('console');
```

### log info warn error debug

The log function for logger

```js
const Logger = require('timtam-logger');
const logger = new Logger({
  app: 'my-app',
});
logger.add('console');
logger.info('my test');
```

### wrap

Wrap the function of target to use logger

- `target` The target to wrap 
- `fns` The function to wrap, default is 'log', 'info', 'warn', 'error', 'debug'

```js
const Logger = require('timtam-logger');
const logger = new Logger({
  app: 'my-app',
});
logger.add('console');

logger.wrap(console);
console.info('my test');
```

### before after

Use to insertBefore(insertAfter) some content to the log

- `param` The insert message string or function to get the insert message

```js
const Logger = require('timtam-logger');
const logger = new Logger({
  app: 'my-app',
});
logger.add('console');
logger.after('--end');
logger.after(() => '--start');
```


## License

MIT
