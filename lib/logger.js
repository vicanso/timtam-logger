"use strict";
var traceback = require('traceback');
var util = require('util');
var env = process.env.NODE_ENV || 'development';
if(env === 'development'){
  require('colors');
}
var fs = require('fs');
var mkdirp = require('mkdirp');
var moment = require('moment');
var path = require('path');

// log的模式，可以选择console file等
var logMode = 'console';
// log存放的目录
var logPath = null;
// log存放的stream流
var logStream = null;

// log临时的缓存数据，用于file模式
var logCacheList = [];
// 当前日期（YYYY-MM-DD）用于将log按日存储
var currentDate = null;

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
  if(env !== 'development' || logMode !== 'console'){
    formatStr = 'YYYY-MM-DD ' + formatStr;
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
  var func = orignalConsole[fn];
  args.unshift(str);
  if(logMode === 'file'){
    saveToFile(util.format.apply(util, args), time);
  }else{
    func.apply(console, args);
  }
};



var saveToFile = function(str, time){
  var date = time.substring(0, 10);
  var stream = getWriteStream(date);
  stream.write(str + '\n');
};

var getWriteStream = function(date){
  if(logStream && date === currentDate){
    return logStream;
  }
  if(logStream){
    logStream.end();
  }
  var file = path.join(logPath, date);
  logStream = fs.createWriteStream(file, {
    flags : 'a'
  });
  return logStream;
}

var funcList = 'error info log warn'.split(' ');
var orignalConsole = {};
funcList.forEach(function(fn){
  orignalConsole[fn] = console[fn];
  console[fn] = function(){
    var args = Array.prototype.slice.call(arguments);
    jtLog(fn, args);
  };
});




Object.defineProperty(exports, 'mode', {
  set : function(v){
    logMode = v
  },
  get : function(){
    return logMode;
  }
});


Object.defineProperty(exports, 'logPath', {
  set : function(v){
    logPath = v
    mkdirp.sync(logPath);
  },
  get : function(){
    return logPath;
  }
});


