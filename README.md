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

set logger options, default options: {"app": "timtam", "timestamp": true, "maxLength": 900}

```js
const logger = require('timtam-logger');

logger.set('app', 'timtam-test');

logger.set({
  app: 'timtam-test'
});

```

### options

- `app` the application name, default: `timtam'

- `timestamp` add timestamp to the log, default: `true`

- `maxLength` the max length of the log, default: `1000`

wrap an object for logger

```js
const logger = require('timtam-logger');
logger.wrap(console, ['info', 'log']);

// console.info === logger.info;
console.info('Hello World!');
```

### object

the object which add logger function


add udp transport

```js
const logger = require('timtam-logger');
// logger.add(transportType, options);
logger.add('udp', {
  port: 6000,
  host: '127.0.0.1'
});
// or use uri
logger.add('udp://127.0.0.1:6000');
```


### transportType

the transport type: `udp`, `console`

### options

- `port` server port. Use in transport `udp` and `console`.

- `host` server host. Use in transport `udp`.


remove transport

```js
const logger = require('timtam-logger');
const udpTransport = logger.add('udp', {
  port: 6000,
  host: '127.0.0.1'
});
setTimeout(function(){
  logger.remove(udpTransport);
}, 10 * 1000);
```



## License

MIT
