'use strict';
const Transport = require('./transport');
const dgram = require('dgram');
const debug = require('debug')('jt.timtam-logger');
class UDP extends Transport {
	constructor(options) {
		super(options);
		this.client = dgram.createSocket('udp4');
		this.doingCount = 0;
	}
	get name() {
		return 'udp';
	}
	write(data) {
		debug('udp write:%j', data);
		let options = this.options;
		let port = options.port || 6000;
		let host = options.host || '127.0.0.1';
		this.doingCount++;
		let buf = new Buffer(JSON.stringify({
			app: options.app,
			log: data
		}));
		this.client.send(buf, 0, buf.length, port, host, function(err) {
			this.doingCount--;
		});
	}
}


module.exports = UDP;