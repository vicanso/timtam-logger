'use strict';
const assert = require('assert');
const util = require('util');
const Console = require('../transports/console');


describe('transport-console', () => {
	it('should new Console success', () => {
		const transport = new Console();
		assert(transport.options);
		assert.equal(transport.name, 'console');
		assert(util.isFunction(transport.log));
		assert(util.isFunction(transport.write));
		assert(transport.stdout, process.stdout);
		assert(transport.stderr, process.stderr);
	});

	it('should console log success', done => {
		const transport = new Console();
		let msgList = ['[info] Hello World!', '[error] Hello World!']
		const writeObj = {
			write: (msg) => {
				assert.equal(msg, msgList.shift());
				if (!msgList.length) {
					done();
				}
			}
		};
		transport.stdout = writeObj;
		transport.stderr = writeObj;

		transport.log('info', 'Hello World!');
		transport.log('error', 'Hello World!');
	});


	it('should console json log success', done => {
		const transport = new Console({
			format: 'json',
			extra: {
				pid: 123
			}
		});
		transport.stdout = {
			write: (msg) => {
				assert.equal(msg, '{"level":"info","msg":"Hello World!","pid":123}');
				done();
			}
		};
		transport.log('info', 'Hello World!');
	});
});