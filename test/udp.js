'use strict';
const assert = require('assert');
const util = require('util');
const UDP = require('../transports/udp');
const dgram = require('dgram');


describe('transport-udp', () => {
	it('should new UDP success', () => {
		const transport = new UDP();
		assert(transport.options);
		assert.equal(transport.name, 'udp');
		assert(util.isFunction(transport.log));
		assert(util.isFunction(transport.write));
	});

	it('should send log success by udp', done => {

		const server = dgram.createSocket('udp4');
		server.on('listening', () => {
			const address = server.address();
			const transport = new UDP({
				app: 'timtam-logger',
				port: address.port
			});

			transport.log('info', 'Hello World!');
		});

		server.on('message', (buf) => {
			assert.equal(buf.toString(), 'timtam-logger\t[info] Hello World!');
			server.close(done);
		});
		server.bind();


	});
});