## JTLogger

基于winston，重新封装了console的info、error和warn方法

```js
const logger = require('jtlogger');
logger.init([{
  timestamp: true
}, {
  type: 'file',
  filename: path.join(__dirname, 'test.log')
}, {
  type: 'udp',
  timestamp: true
}]);
console.info('输出测试log');
```


[![Build Status](https://travis-ci.org/vicanso/jtlogger.svg)](https://api.travis-ci.org/vicanso/jtlogger.png)
