# timtam logger


## Installation

```bash
$ npm install timtam-logger
```

## API

init logger

```js
const logger = require('timtam-logger');

logger.init(options)
```

### options

- `app` the application name, default: `timtam'

- `timestamp` add timestamp to the log, default: `true`

- `maxLength` the max length of the log, default: `1000`


add udp transport

```js
const logger = require('timtam-logger');
// logger.add(transportType, options);
logger.add('udp', {
	port: 6000,
	host: '127.0.0.1'
});
```


### transportType

the transport type: `udp`, `tcp`, `console`

### options

- `port` server port. Use in transport `udp` and `tcp`.

- `host` server host. Use in transport `udp` and `tcp`.

- `max` when disconnet, the buffer size for log. Use in transport `tcp`.


remove udp transport

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