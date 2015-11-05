'use strict';
const util = require('util');
const debug = require('debug')('jt.timtam-logger');
const _ = require('lodash');
const Console = require('../transports/console');
const UDP = require('../transports/udp');
const TCP = require('../transports/tcp');
const transports = [];
const defaultOptions = {
	app: 'timtam',
	timestamp: true,
	// 日志最大长度
	maxLength: 1000
};

exports.defaultOptions = defaultOptions;

exports.init = init;
exports.add = add;

function noop() {}

function log(type, str) {
	transports.forEach(function(transport) {
		transport.log(type, str);
	});
}

/**
 * [init description]
 * @return {[type]} [description]
 */
function init(options) {
	_.assign(defaultOptions, options);
	let maxLength = defaultOptions.maxLength;
	let fns = 'log info warn error'.split(' ');
	fns.forEach(function(fn) {
		console[fn] = function() {
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
			};
			log(fn, str);
			return str;
		}
	});
	init = noop;
}


/**
 * [add description]
 * @param {[type]} type    [description]
 * @param {[type]} options [description]
 */
function add(type, options) {
	options = _.extend({}, options, defaultOptions);
	let transport;
	switch (type) {
		case 'udp':
			transport = new UDP(options);
			break;
		case 'tcp':
			transport = new TCP(options);
			break;
		default:
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
	if (index !== -1) {
		transports.splice(index, 1);
	}
}