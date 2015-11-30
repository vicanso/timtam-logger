"use strict";
const assert = require('assert');
const TCP = require('../transports/tcp');



describe('TCP', function() {
	it('should log message successful', function(done) {
		const port = 6000;
		const net = require('net');
		const server = net.createServer(function(c) {
			c.on('data', function(buf) {
				let data = JSON.parse(buf.toString('utf-8', 0, buf.length - 1));
				assert.equal(data.log.level, 'info');
				assert.equal(data.log.message, 'my info');
			});
			c.on('end', function() {
				server.close(done);
			});
		});
		server.listen(port);
		let tcp = new TCP({
			port: port,
			timestamp: true
		});
		assert.equal(tcp.name, 'tcp');
		tcp.log('info', 'my info');
		tcp.close();
	});

});