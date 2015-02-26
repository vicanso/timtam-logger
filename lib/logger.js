"use strict";
var traceback = require('../traceback/api');
var util = require('util');
var dgram = require('dgram');
var env = process.env.NODE_ENV || 'development';
if(env === 'development'){
  require('colors');
}
var fs = require('fs');
var moment = require('moment');
var path = require('path');



var orignalConsole = {};
(function(){
  var funcList = 'error info log warn'.split(' ');
  funcList.forEach(function(fn){
    orignalConsole[fn] = console[fn];
    console[fn] = function(){
      var args = Array.prototype.slice.call(arguments);
      jtLog(fn, args);
    };
  });
})();


function jtLog(type, args){
  var logMode = exports.logMode;
  var trace = traceback();
  var file = trace[2].path;
  var appPath = exports.appPath;
  var fn = type;
  if(appPath){
    file = file.replace(appPath, '');
  }
  if(exports.reject){
    if(exports.reject(file)){
      return;
    }
  }
  var ext = path.extname(file);
  file = file.substring(0, file.length - ext.length);
  var line = trace[2].line;
  var str = '';
  type = '[' + type.charAt(0).toUpperCase() + ']';
  var posInfo = '[' + file + ':' + line + ']';
  var msg = args.shift();
  var formatStr = 'HH:mm:ss.SSS';
  if(env !== 'development'){
    formatStr = 'YYYY-MM-DDT' + formatStr;
  }
  var time = moment().format(formatStr);
  if(env === 'development'){
    
    str = msg;
    str += (' ' + time.grey);
    if(fn == 'error'){
      str += (' ' + posInfo.red);
    }else if(fn == 'warn'){
      str += (' ' + posInfo.yellow);
    }else{
      str += (' ' + posInfo.green);
    }
  }else{
    str = type + ' ' + time + ' ' + msg + ' ' + posInfo;
  }
  if(exports.logPrefix){
    str = exports.logPrefix + str;
  }
  args.unshift(str);
  currentTransports.forEach(function(transport){
    if(transport.type === exports.transports.Console){
      orignalConsole[fn].apply(console, args);
    }else{
      transport.stream.write(util.format.apply(util, args));
    }
  });
}


exports.transports = {
  Console : 0,
  Stream : 1,
  UDP : 2
};


// 添加transport
exports.add = add;
// 删除transport
exports.remove = remove;

// reject函数
exports.reject = null;

//添加的log的前缀
exports.logPrefix = '';



var currentTransports = [];
/**
 * [add 添加transport]
 * @param {[type]} type    transport类型
 * @param {[type]} options [description]
 */
function add(type, options){
  var index = -1;
  currentTransports.forEach(function(transport, i){
    if(index === -1 && transport.type === type){
      index = i;
    }
  });
  var transport = getTransport(type, options);
  if(index === -1){
    currentTransports.push(transport);
  }else{
    currentTransports[index] = transport;
  }
}

/**
 * [remove 删除transport]
 * @param  {[type]} type transport类型
 * @return {[type]}      [description]
 */
function remove(type){
  var index = -1;
  currentTransports.forEach(function(transport, i){
    if(index === -1 && transport.type === type){
      index = i;
    }
  });
  if(index !== -1){
    var transport = currentTransports.splice(index, 1)[0];
    var stream = transport.stream;
    if(stream.close){
      stream.close();
    }
  }
}


/**
 * [getTransport description]
 * @param  {[type]} type    [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function getTransport(type, options){
  var transport = {
    type : type
  };
  switch(type){
    case exports.transports.Console:
      break;
    case exports.transports.Stream:
      transport.stream = options;
    break;
    case exports.transports.UDP:
      transport.stream = getUDPTransport(options);
    break;
    default:
      throw new Error('no support type:' + type);
  }
  return transport;
}


/**
 * [getUDPTransport 获取udp的transport]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function getUDPTransport(options){
  if(!options.host || !options.port){
    throw new Error('host and port can not be null');
  }
  var client = dgram.createSocket("udp4");
  return {
    write : function(msg){
      var buf = new Buffer(msg);
      client.send(buf, 0, buf.length, options.port, options.host, function(err){
        if(err){
          orignalConsole.error(err);
        }
      });
    },
    close : function(){
      client.close();
    }
  };
}


