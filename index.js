'use strict';
const util = require('util');
const _ = require('lodash');
const Console = require('./transports/console');
const UDP = require('./transports/udp');
const defaultOptions = {
	app: 'timtam',
	timestamp: true,
	// 日志最大长度
	maxLength: 900
};
const defaultFns = 'log info warn error'.split(' ');
const transports = [];


exports.wrap = wrap;
exports.add = add;
exports.remove = remove;
exports.set = set;

init();



function log(type, str) {
	transports.forEach(function(transport) {
		transport.log(type, str);
	});
}

function init() {
	wrap(exports);
}


function wrap(obj, fns) {
	fns = fns || defaultFns;
	_.forEach(fns, fn => {
		obj[fn] = function() {
			const maxLength = defaultOptions.maxLength;
			let args = Array.from(arguments);
			if (fn === 'error') {
				args = args.map(function(argument) {
					if (util.isError(argument)) {
						return 'Error:' + argument.message + ', stack:' +
							argument.stack;
					} else {
						return argument;
					}
				});
			}
			let str = util.format.apply(util, args);
			if (str.length > maxLength) {
				str = str.substring(0, maxLength) + '...';
			}
			log(fn, str);
			return str;
		};
	});
}

function set(k, v) {
	if (_.isObject(k)) {
		_.extend(defaultOptions, k);
	} else {
		defaultOptions[k] = v;
	}
}

/**
 * [add description]
 * @param {[type]} type    [description]
 * @param {[type]} options [description]
 */
function add(type, options) {
	options = _.extend({}, options, defaultOptions);
	let transport;
	if (type === 'udp') {
		transport = new UDP(options);
	} else {
		transport = new Console(options);
	}
	transports.push(transport);
	return transport;
}


/**
 * [remove description]
 * @param  {[type]} transport [description]
 * @return {[type]}           [description]
 */
function remove(transport) {
	let index = transports.indexOf(transport);
	/* istanbul ignore else */
	if (index !== -1) {
		transports.splice(index, 1);
	}
}