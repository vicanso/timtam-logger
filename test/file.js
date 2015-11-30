"use strict";
const assert = require('assert');
const File = require('../transports/file');
const path = require('path');
const fs = require('fs');

describe('Console', function() {
	let file = path.join(__dirname, '' + Date.now());
	let c = new File({
		file: file
	});
	assert.equal(c.name, 'file');
	it('should log message successful', function(done) {
		c.log('info', 'my info');
		c.close(function() {
			let str = fs.readFileSync(file, 'utf-8');
			let data = JSON.parse(str);
			assert.equal(data.log.level, 'info');
			assert.equal(data.log.message, 'my info');
			fs.unlink(file, done);
		});
	});
});