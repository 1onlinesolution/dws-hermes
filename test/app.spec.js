const supertest = require('supertest');
const assert = require('assert');
const { HttpStatus } = require('@1onlinesolution/dws-http');
const app = require('../app');

describe('GET /', function () {
  let request;
  beforeEach(function () {
    request = supertest(app);
  });

  it('responds with json', function (done) {
    request.get('/').set('Accept', 'application/json').expect('Content-Type', /json/).expect(HttpStatus.statusOk, done);
  });

  it('responds with message', function (done) {
    request
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(function (res) {
        // {
        //   "status": 200,
        //   "success": true,
        //   "timestamp": "2021-06-12T09:55:07.000Z",
        //   "value": {
        //     "message": "Welcome to Hermes Service - OK"
        // }
        // }
        assert(res.body.status === HttpStatus.statusOk);
        assert(res.body.success);
        assert(res.body.value.message.includes('Hermes Service'));
      })
      .end(done);
  });
});

describe('GET /wrong-route', function () {
  let request;
  beforeEach(function () {
    request = supertest(app);
  });

  it('responds with not found', function (done) {
    request
      .get('/wrong-route')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(function (res) {
        // {
        //   "status": 404,
        //   "success": false,
        //   "timestamp": "2021-06-12T09:55:07.000Z",
        //   "value": {
        //     "message": "... not found"
        // }
        // }
        assert(res.body.status === HttpStatus.statusNotFound);
        assert(res.body.success === false);
        assert(res.body.value.message.includes('not found'));
      })
      .end(done);
  });
});

describe('GET /api/mail', function () {
  let request;
  beforeEach(function () {
    request = supertest(app);
  });

  it('responds with not found', function (done) {
    request
      .get('/api/mail')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(function (res) {
        // {
        //   "status": 404,
        //   "success": false,
        //   "timestamp": "2021-06-12T09:55:07.000Z",
        //   "value": {
        //     "message": "... not found"
        // }
        // }
        assert(res.body.status === HttpStatus.statusNotFound);
        assert(res.body.success === false);
        assert(res.body.value.message.includes('not found'));
      })
      .end(done);
  });
});

describe('POST /api/mail', function () {
  let request;
  beforeEach(function () {
    request = supertest(app);
  });

  it('responds with server error if message is not defined', function (done) {
    request
      .post('/api/mail')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(function (res) {
        // {
        //   "status": 404,
        //   "success": false,
        //   "timestamp": "2021-06-12T09:55:07.000Z",
        //   "value": {
        //     "message": "... not found"
        // }
        // }
        assert(res.body.status === HttpStatus.statusServerError);
        assert(res.body.success === false);
        assert(res.body.value === HttpStatus.statusNameServerError);
        assert(res.body.error.includes('message is not valid'));
      })
      .end(done);
  });

  it('responds with success if message is defined', function (done) {
    const message = {
      from: 'team@damianos.io',
      to: 'team@damianos.io',
      subject: 'New user registration',
      text: 'Hello world',
    };

    // (async () => {
    //   try {
    //     const res = await request.post('/api/mail').send({ message: message });
    //     assert(res.body.status === HttpStatus.statusCreated);
    //     assert(res.body.success === true);
    //     assert(typeof res.body.value === 'object');
    //     assert(res.body.value.accepted);
    //     assert(res.body.value.accepted.length === 1);
    //     assert(res.body.value.rejected);
    //     assert(res.body.value.rejected.length === 0);
    //     assert(res.body.value.response.includes('250 2.0.0 Ok: queued as'));
    //     assert(res.body.value.envelope.from === message.from);
    //     assert(res.body.value.envelope.to.length === 1);
    //     assert(res.body.value.envelope.to[0] === message.to);
    //     done();
    //   } catch (err) {
    //     done(err);
    //   }
    // })();

    request
      .post('/api/mail')
      .send({ message: message })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      // .expect(HttpStatus.statusCreated)
      .then((res) => {
        console.log('res.body.status: ', res.body.status);
        console.log('res.body', res.body);
        assert(res.body.status === HttpStatus.statusCreated);
        assert(res.body.success === true);
        assert(typeof res.body.value === 'object');
        assert(res.body.value.accepted);
        assert(res.body.value.accepted.length === 1);
        assert(res.body.value.rejected);
        assert(res.body.value.rejected.length === 0);
        assert(res.body.value.response.includes('250 2.0.0 Ok: queued as'));
        assert(res.body.value.envelope.from === message.from);
        assert(res.body.value.envelope.to.length === 1);
        assert(res.body.value.envelope.to[0] === message.to);
        done();
      })
      .catch((err) => done(err));
  });
});
