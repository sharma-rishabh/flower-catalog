const assert = require('assert');
const request = require('supertest');
const { createApp } = require('../src/app.js');

const mockReadFileSync = (ExpectedFiles, ExpectedContent) => {
  let index = 0;
  return (file, encoding) => {
    assert.strictEqual(file, ExpectedFiles[index]);
    const content = ExpectedContent[index];
    index++;
    return content;
  }
}

describe('GET /abc', () => {
  it('should show not found handler', (done) => {
    const req = request(createApp(process.env, {}, () => { }, {}));
    req.get('/abc')
      .expect('content-type', 'text/html; charset=utf-8')
      .expect(404, done)
  });
});

describe('GET /staticFile', () => {
  it('should do serve a static file from the given directory.', (done) => {
    const req = request(createApp(process.env, {}, () => { }, {}));
    req.get('/index.html')
      .expect('content-type', 'text/html; charset=UTF-8')
      .expect('content-length', '756')
      .expect(200, done)
  });
});

describe('GET /guest-book', () => {
  it('should serve all the comments.', (done) => {
    const mockedReadFileSync = mockReadFileSync(
      ['./src/commentForm.html'],
      ['hello']
    );
    fs = {
      readFileSync: mockedReadFileSync
    }
    const req = request(createApp(process.env, {}, () => { }, fs));
    req.get('/guest-book')
      .expect('content-type', 'text/html; charset=utf-8')
      .expect(200, done)
  });
});
