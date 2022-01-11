'use strict';
const assert = require('assert');
const ref = require('../');
const inspect = require('util').inspect;

describe('external_arraybuffer', function() {
  this.slow(10);

  it('should get an array buffer with number address', function() {
    const buf = Buffer.from('hello' + '\0');
    const address = ref.address(buf);
    const ab = ref.readExternalArrayBuffer(address, 6);
    assert.strictEqual(typeof ab, 'object');
    const buffer = Buffer.from(ab);
    const address2 = ref.address(buffer);
    assert.strictEqual(address, address2);
    assert.strictEqual('hello', buffer.readCString());
    // when buffer gets changed, the original buf should be changed too
    buffer.writeCString('olleh');
    assert.strictEqual('olleh', buf.readCString());
  });
  
  it('should get an array buffer with string address', function() {   
    const buf = Buffer.from('hello' + '\0'); 
    const hexAddress = ref.hexAddress(buf);
    const ab = ref.readExternalArrayBuffer('0x' + hexAddress, 6);
    assert.strictEqual(typeof ab, 'object');
    const buffer = Buffer.from(ab);
    const address2 = ref.hexAddress(buffer);
    assert.strictEqual(hexAddress, address2);
    assert.strictEqual('hello', buffer.readCString());
    // when buffer gets changed, the original buf should be changed too
    buffer.writeCString('olleh');
    assert.strictEqual('olleh', buf.readCString());
  }); 
    
  it('measure data processing with C++', function() {
    const frameDataLength = 8294400;
    const buf = Buffer.alloc(frameDataLength);
    const address = ref.address(buf);
    const ab = ref.bgraToRgbaAndReadExternalAB(address, frameDataLength);
    let buffer = new Uint8ClampedArray(ab)
  });
  
  it('measure data processing with js', function() {
    const frameDataLength = 8294400;
    const buf = Buffer.alloc(frameDataLength, 0);
    const address = ref.address(buf);
    let start = Date.now();
    const ab = ref.readExternalArrayBuffer(address, frameDataLength);
    let buffer = new Uint8ClampedArray(ab)
    // 将BGRA 转为 RGBA
    // 1090p的frameDataLength为8294400，循环2073600次
    // for (let pos = 0; pos < frameDataLength; pos += 4) {
    for (let pos = frameDataLength; pos -= 4; ) {
      let b = buffer[pos]
      let rpos = pos + 2
      // r
      buffer[pos] = buffer[rpos]    
      buffer[rpos] = b
    }
    // 倒序循环会漏掉第一个像素
    let b = buffer[0]
    buffer[0] = buffer[2]    
    buffer[2] = b
    let time = Date.now() - start;

    });
});