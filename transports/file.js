'use strict';
const Transport = require('./transport');
const debug = require('debug')('jt.timtam-logger');
const fs = require('fs');

class File extends Transport {
	constructor(options) {
		super(options);
		this.stream = fs.createWriteStream(options.file, {
			flags: 'a+'
		});
	}
	get name() {
		return 'file';
	}
	close(cb) {
		this.stream.end(cb);
	}
	write(data) {
		debug('file write:%j', data);
		let options = this.options;
		let buf = new Buffer(JSON.stringify({
			app: options.app,
			log: data
		}));
		this.stream.write(buf);
	}
}


module.exports = File;