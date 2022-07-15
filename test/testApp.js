const assert = require('assert');
const request = require('supertest');
const { createApp } = require('../src/app.js');

const mockReadFileSync = (expectedFiles, expectedContent) => {
  let index = 0;
  return (file, encoding) => {
    assert.strictEqual(file, expectedFiles[index]);
    assert.strictEqual(encoding, 'utf8');
    const content = expectedContent[index];
    index++;
    return content;
  };
};

const mockWriteFileSync = (expectedFile, expectedContent) => {
  return (file, content, encoding) => {
    assert.strictEqual(file, expectedFile);
    assert.strictEqual(content, expectedContent);
  };
};

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
    const fs = {
      readFileSync: mockedReadFileSync
    }
    const sessions = { 1: { sessionId: 1, username: 'rishabh' } }
    const req = request(createApp(process.env, sessions, () => { }, fs));
    req.get('/guest-book')
      .set('Cookie', 'sessionId=1')
      .expect(200, done)
  });

  it('should redirect to login if not logged in.', (done) => {
    const mockedReadFileSync = mockReadFileSync(
      ['./src/commentForm.html'],
      ['hello']
    );
    const fs = {
      readFileSync: mockedReadFileSync
    }
    const sessions = { 1: { sessionId: 1, username: 'rishabh' } }
    const req = request(createApp(process.env, sessions, () => { }, fs));
    req.get('/guest-book')
      .expect(302, done)
  });
});

describe('GET /login', () => {
  it('should redirect to /login.html', (done) => {
    const mockedReadFileSync = mockReadFileSync(
      ['./src/commentForm.html'],
      ['hello']
    );
    const fs = {
      readFileSync: mockedReadFileSync
    }
    const req = request(createApp(process.env, {}, () => { }, fs));
    req.get('/login')
      .expect('location', '/login.html')
      .expect(302, done)
  });

  it('should redirect to /guest-book if already logged in.', (done) => {
    const mockedReadFileSync = mockReadFileSync(
      ['./src/commentForm.html'],
      ['hello']
    );
    const fs = {
      readFileSync: mockedReadFileSync
    }
    const sessions = { 1: { sessionId: 1, name: 'rishabh' } };
    const req = request(createApp(process.env, sessions, () => { }, fs));
    req.get('/login')
      .set('Cookie', 'sessionId=1')
      .expect('location', '/guest-book')
      .expect(302, done)
  });
});

describe('POST /login', () => {
  it('should post the login details', (done) => {
    const users = { rishabh: { username: 'rishabh', password: '123' } };
    const mockedReadFileSync = mockReadFileSync(
      [process.env.commentsFile, process.env.flowerData, process.env.usersData, './data/users.json'],
      ['hello', , JSON.stringify(users)]
    );
    const fs = {
      readFileSync: mockedReadFileSync
    }
    const sessions = { 1: { sessionId: 1, username: 'rishabh' } }
    const req = request(createApp(process.env, sessions, () => { }, fs));
    req.post('/login')
      .send('username=rishabh&password=123')
      .expect('location', '/guest-book')
      .expect(302, done)
  });

  it('should redirect to /guest-book if already logged in', (done) => {
    const users = { rishabh: { username: 'rishabh', password: '123' } };
    const mockedReadFileSync = mockReadFileSync(
      [process.env.commentsFile, process.env.flowerData, process.env.usersData],
      ['hello', , JSON.stringify(users)]
    );
    const fs = {
      readFileSync: mockedReadFileSync
    }
    const sessions = { 1: { sessionId: 1, username: 'rishabh' } }
    const req = request(createApp(process.env, sessions, () => { }, fs));
    req.post('/login')
      .send('username=rishabh&password=123')
      .set('Cookie', 'sessionId=1')
      .expect('location', '/guest-book')
      .expect(302, done)
  });

  it('should send 422 if fields are not given properly', (done) => {
    const users = { rishabh: { username: 'rishabh', password: '123' } };

    const mockedReadFileSync = mockReadFileSync(
      [process.env.commentsFile, process.env.flowerData, process.env.usersData],
      ['hello', , JSON.stringify(users)]
    );

    const fs = {
      readFileSync: mockedReadFileSync
    }

    const sessions = { 1: { sessionId: 1, username: 'rishabh' } }
    const req = request(createApp(process.env, sessions, () => { }, fs));
    req.post('/login')
      .send('username=rishabh')
      .expect(400, done)
  });
});

describe('GET /logout', () => {
  it('should clear cookie of user.', (done) => {
    const users = { rishabh: { username: 'rishabh', password: '123' } };

    const mockedReadFileSync = mockReadFileSync(
      [process.env.commentsFile, process.env.flowerData, process.env.usersData],
      ['hello', , JSON.stringify(users)]
    );

    const fs = {
      readFileSync: mockedReadFileSync
    }

    const sessions = { 1: { sessionId: 1, username: 'rishabh' } }
    const req = request(createApp(process.env, sessions, () => { }, fs));
    req.get('/logout')
      .set('Cookie', 'sessionId=1')
      .expect('set-cookie', 'sessionId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
      .expect(302, done)
  });

  it('should redirect to home if user is not logged in.', (done) => {
    const users = { rishabh: { username: 'rishabh', password: '123' } };

    const mockedReadFileSync = mockReadFileSync([
      process.env.commentsFile, process.env.flowerData, process.env.usersData],
      ['hello', , JSON.stringify(users)]
    );

    const fs = {
      readFileSync: mockedReadFileSync
    }

    const sessions = { 1: { sessionId: 1, username: 'rishabh' } };
    const req = request(createApp(process.env, sessions, () => { }, fs));
    req.get('/logout')
      .expect(302, done)
  });
});

describe('GET /signup', () => {
  it('should redirect to /signup.html', (done) => {
    const req = request(createApp(process.env, {}, () => { }, {}));
    req.get('/signup')
      .expect(302, done)
      .expect('location', '/signup.html')
  });
  it('should redirect to / if user is already logged in.', (done) => {
    const sessions = { 1: { sessionId: 1, username: 'rishabh' } };
    const req = request(createApp(process.env, sessions, () => { }, {}));
    req.get('/signup')
      .set('Cookie', 'sessionId=1')
      .expect(302, done)
      .expect('location', '/')
  });
});

describe('POST /signup', () => {
  it('should redirect to home if user is already logged in.', (done) => {
    const sessions = { 1: { sessionId: 1, username: 'rishabh' } };
    const req = request(createApp(process.env, sessions, () => { }, {}));
    req.post('/signup')
      .set('Cookie', 'sessionId=1')
      .expect(302, done)
  });

  it('should send code 400 if user details are not sent properly.', (done) => {
    const req = request(createApp(process.env, {}, () => { }, {}));
    req.post('/signup')
      .send('username=abc')
      .expect(400, done)
  });

  it('should send code 409 if user already exists.', (done) => {
    const users = { rishabh: { username: 'rishabh', password: '123' } };

    const mockedReadFileSync = mockReadFileSync(
      [process.env.commentsFile, process.env.flowerData, process.env.usersData],
      [, , JSON.stringify(users)]
    );

    const fs = {
      readFileSync: mockedReadFileSync,
    }

    const req = request(createApp(process.env, {}, () => { }, fs));
    req.post('/signup')
      .send('username=rishabh&password=123')
      .expect(409, done)
  });

  it('should send 200 if user detail are persisted.', (done) => {
    const users = { rishabh: { username: 'rishabh', password: '123' } };
    const expectedUsers = {
      rishabh: { username: 'rishabh', password: '123' },
      abc: { username: 'abc', password: '123' }
    }

    const mockedReadFileSync = mockReadFileSync(
      [process.env.commentsFile, process.env.flowerData, process.env.usersData],
      [, , JSON.stringify(users)]
    );

    const mockedWriteFileSync = mockWriteFileSync(process.env.usersData, JSON.stringify(expectedUsers));

    const fs = {
      readFileSync: mockedReadFileSync,
      writeFileSync: mockedWriteFileSync
    }

    const req = request(createApp(process.env, {}, () => { }, fs));
    req.post('/signup')
      .send('username=abc&password=123')
      .expect(200, done)
  });
});
