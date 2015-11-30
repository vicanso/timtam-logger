"use strict";
const assert = require('assert');
const Console = require('../transports/console');


describe('Console', function() {
	let c = new Console();
	it('should log message successful', function(done) {
		assert.equal(c.name, 'console');
		c.stdout = {
			write: function(msg) {
				let index = msg.indexOf('info: info message');
				assert(index !== -1);
				c.stdout = process.stdout;
				done();
			}
		};
		c.log('info', 'info message');
	});

	it('should log error message successful', function(done) {
		c.stderr = {
			write: function(msg) {
				let index = msg.indexOf('error: Error: my error');
				assert(index !== -1);
				c.stderr = process.stderr;
				done();
			}
		};
		c.log('error', new Error('my error'));
	});
});