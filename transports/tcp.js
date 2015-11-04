'use strict';
const Transport = require('./transport');
const net = require('net');
const debug = require('debug')('jt.timtam-logger');
const _ = require('lodash');
class TCP extends Transport {
	constructor(options) {
		super(options);
		this.connect();
		this.buffers = [];
	}
	connect() {
		let options = this.options;
		let port = options.port || 6000;
		let host = options.host || '127.0.0.1';
		let client = net.createConnection(port, host, this.flush.bind(this));
		let reconnect = _.debounce(function() {
			this.client.end();
			this.connect();
			// console.info('timtam tcp transport reconnect');
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
		let client = this.client;
		if (client.writable) {
			client.write(buf);
		} else {
			this.buffers.push(buf);
		}
	}
	flush() {
		this.buffers.forEach(function(buf) {
			this.client.write(buf);
		}.bind(this));
		this.buffers.length = 0;
	}
}


module.exports = TCP;