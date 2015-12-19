'use strict';
const Transport = require('./transport');
const debug = require('debug')('jt.timtam-logger');

class Console extends Transport {
	constructor(options) {
		super(options);
		debug('options:%j', options);
		this._stdout = process.stdout;
		this._stderr = process.stderr;
	}
	get name() {
		return 'console';
	}
	get stdout() {
		return this._stdout;
	}
	get stderr() {
		return this._stderr;
	}
	set stdout(_stdout) {
		/* istanbul ignore else */
		if (_stdout) {
			this._stdout = _stdout;
		}
	}
	set stderr(_stderr) {
		/* istanbul ignore else */
		if (_stderr) {
			this._stderr = _stderr;
		}
	}
	write(data, level) {
		debug('console write:%j', data);
		/* istanbul ignore else */
		if (this.options.format === 'json') {
			data = JSON.stringify(data);
		}
		if (level === 'error') {
			this.stderr.write(data);
		} else {
			this.stdout.write(data);
		}
	}
}


module.exports = Console;