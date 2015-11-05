'use strict';
const Transport = require('./transport');
const net = require('net');
const debug = require('debug')('jt.timtam-logger');
const _ = require('lodash');
class TCP extends Transport {
	constructor(options) {
		options = _.extend({
			// 当连接中断，buffer的数据量最大值
			max: 500
		}, options);
		super(options);
		this.connect();
		this.buffers = [];
		this.endBuf = new Buffer(1);
		this.endBuf[0] = 0;
	}
	get name() {
		return 'tcp';
	}
	connect() {
		let options = this.options;
		let port = options.port || 6000;
		let host = options.host || '127.0.0.1';
		let client = net.createConnection(port, host, this.flush.bind(this));
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
		let client = this.client;

		if (client.writable) {
			client.write(buf);
		} else {
			let buffers = this.buffers;
			buffers.push(buf);
			if (buffers.length > options.max) {
				buffers.shift();
			}
		}
	}
	flush() {
		let buffers = this.buffers;
		buffers.forEach(function(buf) {
			this.client.write(buf);
		}.bind(this));
		buffers.length = 0;
	}
}


module.exports = TCP;