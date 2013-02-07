# jtlogger - node.js的logger，基于log4js

## 特性

- 允许配置不同的log类型（log info error warn debug trace）,输出到各自的logger文件
- 支持log4js的所有appender
- 不同的logger可以有不同的前缀输出（主要用于输出该log所在的运行文件）
- 可以为不同的log方法添加输出行号

##Demo1
```js
var jtLogger, logger1, logger2;
jtLogger = require('jtlogger');
jtLogger.moreInfoLog(['error']);
logger1 = jtLogger.getLogger('logger1');
logger2 = jtLogger.getLogger(['logger2', '前缀']);
logger1.info('测试输出一');
logger2.warn('测试输出二');
logger2.error('测试输出三');
```

##Demo2
```js
var appenders, jtLogger, logger, myLogger;
jtLogger.moreInfoLog(['error']);
appenders = [
  {
    type: 'console'
  }, {
    type: 'file',
    filename: './filelog'
  }, {
    type: 'dateFile',
    category: '[ERROR-LOGGER]',
    filename: './errorlog'
  }, {
    type: 'dateFile',
    category: 'mylog',
    filename: './mylog'
  }
];
jtLogger = require('jtlogger');
jtLogger.configure({
  appenders: appenders
});
logger = jtLogger.getLogger(__filename);
myLogger = jtLogger.getLogger(__filename, 'mylog');
logger.info('info log');
logger.error('error log');
myLogger.info('my log');

/*
以下为运行结果
errorlog文件内容
[2013-01-31 23:10:20.239] [ERROR] [ERROR-LOGGER] - [/Users/Tree/快盘/workspace/node_modules/jtlogger/example/demo2.js] 'at Object.<anonymous> (/Users/Tree/快盘/workspace/node_modules/jtlogger/example/demo2.js:33:10)' 'error log'

filelog文件内容
[2013-01-31 23:10:20.183] [INFO] [INFO-LOGGER] - [/Users/Tree/快盘/workspace/node_modules/jtlogger/example/demo2.js] 'info log'
[2013-01-31 23:10:20.239] [ERROR] [ERROR-LOGGER] - [/Users/Tree/快盘/workspace/node_modules/jtlogger/example/demo2.js] 'at Object.<anonymous> (/Users/Tree/快盘/workspace/node_modules/jtlogger/example/demo2.js:33:10)' 'error log'
[2013-01-31 23:10:20.241] [INFO] mylog - [/Users/Tree/快盘/workspace/node_modules/jtlogger/example/demo2.js] 'my log' 

mylog文件内容
[2013-01-31 23:10:20.241] [INFO] mylog - [/Users/Tree/快盘/workspace/node_modules/jtlogger/example/demo2.js] 'my log'
*/
```

##API

- [moreInfoLog](#moreInfoLog)
- [configure](#configure)
- [getLogger](#getLogger)
- [getConnectLogger](#getConnectLogger)
- [log info error warn debug trace](#log)

<a name="wrapLogHandle" />
## moreInfoLog
### 将该log所在行号和函数添加到输出

### 参数列表
- funcs 需要添加的log方法名（log info error warn debug trace），可以为单一个方法名或者一个数组（里面保存多个方法名）

```js
var jtLogger = require('jtlogger');
jtLogger.moreInfoLog('info');
jtLogger.moreInfoLog(['warn', 'error']);
```

<a name="configure" />
## configure
### 配置logger（直接调用log4js的configure）, 主要用于配置appenders

```js
var appenders, jtLogger;
appenders = [
  {
    type: 'console'
  }, {
    type: 'file',
    filename: './filelog'
  }, {
    type: 'dateFile',
    category: '[ERROR-LOGGER]',
    filename: './errorlog'
  }, {
    type: 'dateFile',
    category: 'mylog',
    filename: './mylog'
  }
];
jtLogger = require('jtlogger');
jtLogger.configure({
  appenders: appenders
});
```

<a name="getLogger" />
## getLogger
### 获取一个logger实例

### 参数列表
- msgPrefix 该logger的所有输出带上的前缀（主要是带上__filename之类标识该log是由哪个文件输出），参数可以为String或Array
- category 用于该log分类输出到不同的文件（log4js中使用category来分开log文件的输出）（参数可选）

```js
var jtLogger = require('jtlogger');
var logger = jtLogger.getLogger(__filename);
```

<a name="getConnectLogger" />
## getConnectLogger
### 返回用于connect中http的logger方法(该logger的category配置为CONNECT-LOGGER)，为connect中use的函数

### 参数列表
- msgPrefix 该logger的所有输出带上的前缀（主要是带上标记用于标记该logger），参数可以为String或Array
- options connect的http log的配置

```js
var jtLogger = require('jtlogger');
var express = require('express');
app.use(jtLogger.getConnectLogger 'HTTP-LOGGER', {
  format : "#{express.logger.default} -- :response-time ms"
});
```

<a name="log" />
## log info error warn debug trace
### logger的输出，用于不同级别的输出

```js
var jtLogger = require('jtlogger');
var logger = jtLogger.getLogger(__filename);
logger.log('log');
logger.info('info');
logger.error('error');
logger.warn('warn');
logger.debug('debug');
logger.trace('trace');
```