'use strict';
const Transport = require('./transport');
const debug = require('debug')('jt.timtam-logger');
const _ = require('lodash');
const dgram = require('dgram');
class UDP extends Transport {
	constructor(options) {
		options = _.extend({}, {
			separator: 9,
			port: 7001,
			host: '127.0.0.1'
		}, options);
		super(options);
		const bufPrefix = new Buffer(options.app + ' ');
		bufPrefix[bufPrefix.length - 1] = options.separator;
		this._bufPrefix = bufPrefix;
		this._client = dgram.createSocket('udp4');
		debug('options:%j', options);
	}
	get name() {
		return 'udp';
	}
	write(data) {
		debug('udp write:%s', data);
		const options = this.options;
		const buf = Buffer.concat([this._bufPrefix, new Buffer(data)]);
		this._client.send(buf, 0, buf.length, options.port, options.host);
	}
}


module.exports = UDP;