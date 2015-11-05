'use strict';

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
		let data = {
			message: msg,
			level: level
		};
		if (options.timestamp) {
			data.date = (new Date()).toISOString();
		}
		this.write(data);
	}
}


module.exports = Transport;