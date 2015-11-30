'use strict';
const Transport = require('./transport');
const util = require('util');
const debug = require('debug')('jt.timtam-logger');
class Console extends Transport {
	constructor(options) {
		super(options);
		this._stderr = process.stderr;
		this._stdout = process.stdout;
	}
	get name() {
		return 'console';
	}
	get stdout() {
		return this._stdout;
	}
	set stdout(_stdout) {
		if (_stdout) {
			this._stdout = _stdout;
		}
	}
	get stderr() {
		return this._stderr;
	}
	set stderr(_stderr) {
		if (_stderr) {
			this._stderr = _stderr;
		}
	}
	write(data) {
		debug('console write:%j', data);
		let level = data.level;
		let date = data.date || (new Date()).toISOString();
		let message = data.message;
		let str = util.format('%s - %s: %s\n', date, level, message);
		if (level === 'error') {
			this.stderr.write(str);
		} else {
			this.stdout.write(str);
		}
	}
}


module.exports = Console;