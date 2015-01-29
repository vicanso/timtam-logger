"use strict";
var traceback = require('../traceback/api');
var util = require('util');
var env = process.env.NODE_ENV || 'development';
if(env === 'development'){
  require('colors');
}
var fs = require('fs');
var mkdirp = require('mkdirp');
var moment = require('moment');
var path = require('path');




// log存放的stream流
var logStream = null;


var jtLog = function(type, args){
  var logMode = exports.logMode;
  var trace = traceback();
  var file = trace[2].path;
  var appPath = exports.appPath;
  var fn = type;
  if(appPath){
    file = file.replace(appPath, '');
  }
  if(exports.filter){
    if(!exports.filter(file)){
      orignalConsole[fn].apply(console, args);
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
  if(env === 'development' && logMode === 'console'){
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
  if(exports.logPrefix){
    str = exports.logPrefix + str;
  }
  args.unshift(str);
  if(logStream){
    logStream.write(util.format.apply(util, args));
  }else{
    orignalConsole[fn].apply(console, args);
  }
};

var orignalConsole = {};
var wrapConsole = function(){
  var funcList = 'error info log warn'.split(' ');
  funcList.forEach(function(fn){
    orignalConsole[fn] = console[fn];
    console[fn] = function(){
      var args = Array.prototype.slice.call(arguments);
      jtLog(fn, args);
    };
  });
};


// log的模式，可以选择console file等
exports.logMode = 'console';


// log存放的目录
exports.logPath = null;

// filter函数
exports.filter = null;

//添加的log的前缀
exports.logPrefix = '';

Object.defineProperty(exports, 'stream', {
  set : function(v){
    logStream = v;
  },
  get : function(){
    return logStream;
  }
});


wrapConsole();
