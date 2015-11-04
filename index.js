'use strict';
const logger = require('./lib/logger');

logger.init({
	app: 'test'
});

logger.add('console');
logger.add('udp', {
	port: 6000
});
logger.add('tcp', {
	port: 6000
});

setInterval(function() {
	console.info('test');
}, 5 * 1000);