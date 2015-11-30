'use strict';
const Transport = require('./transport');
const net = require('net');
const debug = require('debug')('jt.timtam-logger');
const _ = require('lodash');
class TCP extends Transport {
	constructor(options) {
		options = _.extend({}, options);
		super(options);
		this.connect();
		this.endBuf = new Buffer(1);
		this.endBuf[0] = 0;
	}
	get name() {
		return 'tcp';
	}
	close() {
		this.client.end();
	}
	connect() {
		let options = this.options;
		let port = options.port || 6000;
		let host = options.host || '127.0.0.1';
		let client = net.createConnection(port, host);
		/* istanbul ignore next */
		let reconnect = _.debounce(function() {
			this.client.end();
			this.connect();
			console.info('timtam tcp transport reconnect');
		}.bind(this), 2000);
		client.on('end', reconnect);
		client.on('error', reconnect);
		this.client = client;
	}
	write(data) {
		debug('tcp write:%j', data);
		let options = this.options;
		let buf = new Buffer(JSON.stringify({
			app: options.app,
			log: data
		}));
		buf = Buffer.concat([buf, this.endBuf]);
		this.client.write(buf);
	}
}


module.exports = TCP;