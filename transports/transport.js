'use strict';
const debug = require('debug')('jt.timtam-logger');
const _ = require('lodash');

class Transport {
	constructor(options) {
		options = _.clone(options || {});
		/* istanbul ignore else */
		if (options.extra && options.format !== 'json') {
			options.extra = _.map(options.extra, (v, k) => {
				return k + '=' + v;
			}).join();
		}

		debug('options:%j', options);
		this._options = options;
	}

	write() {
		// 继承的transport各自实现
	}
	get options() {
		return this._options;
	}
	get name() {
		return 'base';
	}
	log(level, msg) {
		const options = this.options;
		const now = (new Date()).toISOString();
		let data;
		if (options.format !== 'json') {
			data = '[' + level + '] ' + msg;
			/* istanbul ignore else */
			if (options.extra) {
				data += (' ' + options.extra);
			}
			/* istanbul ignore else */
			if (options.timestamp) {
				data = now + ' ' + data;
			}
		} else {
			data = _.extend({
				level: level,
				msg: msg
			}, options.extra);
			/* istanbul ignore else */
			if (options.timestamp) {
				data.date = now;
			}
		}
		this.write(data, level);
	}
}

module.exports = Transport;