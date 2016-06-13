'use strict';
const assert = require('assert');
const logger = require('..');
const dgram = require('dgram');

describe('logger', () => {
  it('should log success', done => {
    const transport = logger.add('console');
    transport.stdout = {
      write: (msg) => {
        assert.equal(msg.indexOf('[info] Hello World!'), 25);
        logger.remove(transport);
        done();
      }
    };
    logger.info('Hello World!');
  });

  it('should log error success', done => {
    const transport = logger.add('console');
    transport.stderr = {
      write: (msg) => {
        assert.equal(msg.indexOf('[error] Hello World! Error:fail, stack:Error: fail'), 25);
        logger.remove(transport);
        done();
      }
    };
    logger.error('Hello World! %s', new Error('fail'));
  });

  it('should remove transport success', done => {
    const transport1 = logger.add('console');
    transport1.stdout = {
      write: () => {
        done(new Error('transport1 is not remove'));
      }
    };

    const transport2 = logger.add('console');
    transport2.stdout = {
      write: () => {
        logger.remove(transport2);
        done();
      }
    };
    logger.remove(transport1);
    logger.info('Hello World!');

  });


  it('should send log by udp success', done => {
    logger.set('app', 'timtam-test');
    const server = dgram.createSocket('udp4');
    let transport;
    server.on('listening', () => {
      const address = server.address();
      transport = logger.add('udp', {
        port: address.port
      });

      transport.log('info', 'Hello World!');
    });

    server.on('message', (buf) => {
      const str = buf.toString();
      assert.equal(str.indexOf('[info] Hello World!'), 37);
      assert(str.indexOf('timtam-test') !== -1);
      logger.remove(transport);
      server.close(done);
    });
    server.bind();
  });


  it('should init udp transport by uri success', done => {
    logger.set({
      'app': 'timtam-app'
    });
    const server = dgram.createSocket('udp4');
    let transport;
    server.on('listening', () => {
      const address = server.address();
      transport = logger.add(`udp://127.0.0.1:${address.port}`);

      transport.log('info', 'Hello World!');
    });

    server.on('message', (buf) => {
      const str = buf.toString();
      assert.equal(str.indexOf('[info] Hello World!'), 36);
      assert(str.indexOf('timtam-app') !== -1);
      logger.remove(transport);
      server.close(done);
    });
    server.bind();
  });
});