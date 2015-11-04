'use strict';
const Transport = require('./transport');
const util = require('util');
const debug = require('debug')('jt.timtam-logger');
class Console extends Transport {
	constructor(options) {
		super(options);
	}
	write(data) {
		debug('console write:%j', data);
		let level = data.level;
		let date = data.date || (new Date()).toISOString();
		let message = data.message;
		let str = util.format('%s - %s: %s\n', date, level, message);
		if (level === 'error') {
			process.stderr.write(str);
		} else {
			process.stdout.write(str);
		}
	}
}


module.exports = Console;