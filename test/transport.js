'use strict';
const assert = require('assert');
const util = require('util');
const Transport = require('../transports/transport');
describe('transport', () => {
  it('should new Transport success', () => {
    const transport = new Transport();
    assert(transport.options);
    assert.equal(transport.name, 'base');
    assert(util.isFunction(transport.log));
  });

  it('extra should be text by default', () => {
    const transport = new Transport({
      extra: {
        pid: 123,
        id: 'vicanso',
      },
    });
    assert.equal(transport.options.extra, 'pid=123,id=vicanso');
  });

  it('should write text log success', (done) => {
    const transport = new Transport({
      extra: {
        pid: 123,
      },
      timestamp: true,
    });

    transport.write = (data) => {
      // ISO date string
      assert.equal(data.indexOf('[info] Hello World! pid=123'), 25);
      done();
    };

    transport.log('info', 'Hello World!');
  });


  it('should write json log with date success', (done) => {
    const transport = new Transport({
      extra: {
        pid: 123,
      },
      format: 'json',
      timestamp: true,
    });

    transport.write = (data) => {
      assert.equal(data.level, 'info');
      assert.equal(data.msg, 'Hello World!');
      assert.equal(data.pid, 123);
      assert(data.date);
      done();
    };

    transport.log('info', 'Hello World!');
  });

  it('should set prefix for log success', (done) => {
    const transport = new Transport();
    transport.prefix = 'ABCD';
    transport.write = (data) => {
      assert.equal('[info] ABCD Hello World!', data);
      done();
    };
    transport.log('info', 'Hello World!');
  });
});
