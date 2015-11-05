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
	let str = 'Creates an array of values by running each element in collection through iteratee. The iteratee is bound to thisArg and invoked with three arguments: (value, index|key, collection). If a property name is provided for iteratee the created _.property style callback returns the property value of the given element. ';
	console.info(str);
}, 1);


// console.error(new Error('error'));