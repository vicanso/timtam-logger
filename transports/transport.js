'use strict';
const _ = require('lodash');

class Transport {
	constructor(options) {
		this.options = options;
	}
	write(data) {
		// 继承的transport各自实现
	}
	close() {
		// 继承的transport各自实现
	}
	get name() {
		return 'base';
	}
	log(level, msg) {
		let options = this.options;
		let data = _.extend({
			message: msg,
			level: level
		}, options.extra);
		if (options.timestamp) {
			data.date = (new Date()).toISOString();
		}
		this.write(data);
	}
}


module.exports = Transport;