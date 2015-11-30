"use strict";
const assert = require('assert');
const UDP = require('../transports/udp');



describe('UDP', function() {
	it('should log message successful', function(done) {
		const port = 6000;
		const net = require('net');
		const server = require('dgram').createSocket('udp4');
		server.bind(port);
		server.on('message', function(buf) {
			let data = JSON.parse(buf);
			assert.equal(data.log.level, 'info');
			assert.equal(data.log.message, 'my info');
			server.close(done);
		});
		let udp = new UDP({
			port: port
		});
		assert.equal(udp.name, 'udp');
		udp.log('info', 'my info');
		udp.close();
	});

});