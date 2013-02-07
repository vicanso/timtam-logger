appenders = [
  {
    # 控制台输出
    type : 'console'
  }
  {
    # 所有log的输出文件
    type : 'file'
    filename : './filelog'
  }
  {
    # 只记录error方法输出的log
    type : 'dateFile'
    category : '[ERROR-LOGGER]'
    filename : './errorlog'
  }
  {
    # 只记录创建logger实例时，第二个参数category为mylog的实例输出的log
    type : 'dateFile'
    category : 'mylog'
    filename : './mylog'
  }

]

jtLogger = require '../index'
jtLogger.configure {
  appenders : appenders
}
jtLogger.moreInfoLog 'error'
logger = jtLogger.getLogger __filename
myLogger = jtLogger.getLogger __filename, 'mylog'
logger.info 'info log'
logger.error 'error log'
myLogger.info 'my log'

###
以下为运行结果
errorlog文件内容
[2013-01-31 23:10:20.239] [ERROR] [ERROR-LOGGER] - [/Users/Tree/快盘/workspace/node_modules/jtlogger/example/demo2.js] 'at Object.<anonymous> (/Users/Tree/快盘/workspace/node_modules/jtlogger/example/demo2.js:33:10)' 'error log'


filelog文件内容
[2013-01-31 23:10:20.183] [INFO] [INFO-LOGGER] - [/Users/Tree/快盘/workspace/node_modules/jtlogger/example/demo2.js] 'info log'
[2013-01-31 23:10:20.239] [ERROR] [ERROR-LOGGER] - [/Users/Tree/快盘/workspace/node_modules/jtlogger/example/demo2.js] 'at Object.<anonymous> (/Users/Tree/快盘/workspace/node_modules/jtlogger/example/demo2.js:33:10)' 'error log'
[2013-01-31 23:10:20.241] [INFO] mylog - [/Users/Tree/快盘/workspace/node_modules/jtlogger/example/demo2.js] 'my log'


mylog文件内容
[2013-01-31 23:10:20.241] [INFO] mylog - [/Users/Tree/快盘/workspace/node_modules/jtlogger/example/demo2.js] 'my log'
###
