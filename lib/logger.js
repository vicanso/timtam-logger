"use strict";
var traceback = require('traceback');
var util = require('util');
var env = process.env.NODE_ENV || 'development';
if(env === 'development'){
  require('colors');
}
var moment = require('moment');
var path = require('path');


var jtLog = function(type, args){
  var trace = traceback();
  var file = trace[2].path;
  var appPath = exports.appPath;
  if(appPath){
    file = trace[2].path.replace(appPath, '');
  }
  var ext = path.extname(file);
  file = file.substring(0, file.length - ext.length);
  var line = trace[2].line;
  var str = '';
  var fn = type;
  type = '[' + type.charAt(0).toUpperCase() + ']';
  var posInfo = '[' + file + ':' + line + ']';
  var msg = args.shift();
  var formatStr = 'HH:mm:ss.SSS';
  if(env !== 'development'){
    formatStr = 'YYYY-MM-DD ' + formatStr;
  }
  var time = moment().format(formatStr);
  if(env === 'development'){
    if(fn == 'error'){
      str = posInfo.red;
    }else if(fn == 'warn'){
      str = posInfo.yellow;
    }else{
      str = posInfo.green;
    }
    str += (' ' + msg);
    str += (' ' + time.grey);
  }else{
    str = type + posInfo + ' ' + msg + ' ' + time;
  }
  var func = orignalConsole[fn];
  args.unshift(str);
  if(exports.mode === 'file'){
    // TODO
    console.dir(util.format.apply(util, args));
  }else{
    func.apply(console, args);
  }
};


var funcList = 'error info log warn'.split(' ');
var orignalConsole = {};
funcList.forEach(function(fn){
  orignalConsole[fn] = console[fn];
  console[fn] = function(){
    var args = Array.prototype.slice.call(arguments);
    jtLog(fn, args);
  };
});


exports.mode = 'console';