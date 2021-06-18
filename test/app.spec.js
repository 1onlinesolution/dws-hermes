const sinon = require('sinon');
const supertest = require('supertest');
const assert = require('assert');
const { HttpStatus } = require('@1onlinesolution/dws-http');
const EmailService = require('@1onlinesolution/dws-mail/lib/emailService');
const app = require('../server');
const env = require('../src/env');

const isIntegrationTest = process.env.NODE_ENV === 'test_integration';

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
        assert(res.body.status === HttpStatus.statusNotFound);
        assert(res.body.success === false);
        assert(res.body.value.message.includes('not found'));
      })
      .end(done);
  });
});

describe('*** Integration tests *** POST /api/mail', function () {
  let request;
  beforeEach(function () {
    request = supertest(app);
  });

  it('responds with success if message is defined - 1st way - one email', function (done) {
    if (!isIntegrationTest) {
      this.skip();
      return;
    }

    const message = {
      from: `${env.email.username}`,
      to: `${env.email.username}`,
      subject: '@1onlinesolution/dws-hermes - Testing email service',
      text: 'Hello world',
    };

    request
      .post('/api/mail')
      .send({ message: message })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((res) => {
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

  it('responds with success if message is defined - 1st way - multiple emails', function (done) {
    if (!isIntegrationTest) {
      this.skip();
      return;
    }

    const message = {
      from: `${env.email.username}`,
      to: `${env.email.username},${env.email.username2}`,
      subject: '@1onlinesolution/dws-hermes - Testing email service',
      text: 'Hello world',
    };

    request
      .post('/api/mail')
      .send({ message: message })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((res) => {
        assert(res.body.status === HttpStatus.statusCreated);
        assert(res.body.success === true);
        assert(typeof res.body.value === 'object');
        assert(res.body.value.accepted);
        assert(res.body.value.accepted.length === 2);
        const recipients = message.to.split(',');
        assert(res.body.value.accepted[0] === recipients[0]);
        assert(res.body.value.accepted[1] === recipients[1]);
        assert(res.body.value.rejected);
        assert(res.body.value.rejected.length === 0);
        assert(res.body.value.response.includes('250 2.0.0 Ok: queued as'));
        assert(res.body.value.envelope.from === message.from);
        assert(res.body.value.envelope.to.length === 2);
        assert(res.body.value.envelope.to[0] === recipients[0]);
        assert(res.body.value.envelope.to[1] === recipients[1]);
        done();
      })
      .catch((err) => done(err));
  });

  it('responds with success if message is defined - 1st way - multiple emails via cc', function (done) {
    if (!isIntegrationTest) {
      this.skip();
      return;
    }

    const message = {
      from: `${env.email.username}`,
      to: `${env.email.username}`,
      cc: `${env.email.username2}`,
      subject: '@1onlinesolution/dws-hermes - Testing email service',
      text: 'Hello world',
    };

    request
      .post('/api/mail')
      .send({ message: message })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((res) => {
        assert(res.body.status === HttpStatus.statusCreated);
        assert(res.body.success === true);
        assert(typeof res.body.value === 'object');
        assert(res.body.value.accepted);
        assert(res.body.value.accepted.length === 2);
        assert(res.body.value.accepted[0] === message.to);
        assert(res.body.value.accepted[1] === message.cc);
        assert(res.body.value.rejected);
        assert(res.body.value.rejected.length === 0);
        assert(res.body.value.response.includes('250 2.0.0 Ok: queued as'));
        assert(res.body.value.envelope.from === message.from);
        assert(res.body.value.envelope.to.length === 2);
        assert(res.body.value.envelope.to[0] === message.to);
        assert(res.body.value.envelope.to[1] === message.cc);
        done();
      })
      .catch((err) => done(err));
  });

  it('responds with success if message is defined - 1st way - multiple emails via bcc', function (done) {
    if (!isIntegrationTest) {
      this.skip();
      return;
    }

    const message = {
      from: `${env.email.username}`,
      to: `${env.email.username}`,
      bcc: `${env.email.username2}`,
      subject: '@1onlinesolution/dws-hermes - Testing email service',
      text: 'Hello world',
    };

    request
      .post('/api/mail')
      .send({ message: message })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((res) => {
        assert(res.body.status === HttpStatus.statusCreated);
        assert(res.body.success === true);
        assert(typeof res.body.value === 'object');
        assert(res.body.value.accepted);
        assert(res.body.value.accepted.length === 2);
        assert(res.body.value.accepted[0] === message.to);
        assert(res.body.value.accepted[1] === message.bcc);
        assert(res.body.value.rejected);
        assert(res.body.value.rejected.length === 0);
        assert(res.body.value.response.includes('250 2.0.0 Ok: queued as'));
        assert(res.body.value.envelope.from === message.from);
        assert(res.body.value.envelope.to.length === 2);
        assert(res.body.value.envelope.to[0] === message.to);
        assert(res.body.value.envelope.to[1] === message.bcc);
        done();
      })
      .catch((err) => done(err));
  });

  it('responds with success if message is defined - 2nd way - one email', function (done) {
    if (!isIntegrationTest) {
      this.skip();
      return;
    }

    const message = {
      from: `${env.email.username}`,
      to: `${env.email.username}`,
      subject: '@1onlinesolution/dws-hermes - Testing email service',
      text: 'Hello world',
    };

    (async () => {
      try {
        const res = await request.post('/api/mail').send({ message: message });
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
      } catch (err) {
        done(err);
      }
    })();
  });
});

describe('*** Unit tests *** POST /api/mail', function () {
  let sandbox = null;
  let request;
  beforeEach(function () {
    request = supertest(app);
    sandbox = sinon.createSandbox();
  });
  afterEach(function () {
    sandbox.restore();
  });

  it('responds with server error if message is not defined', function (done) {
    const message = {
      from: 'fromEmail',
      to: 'toEmail',
      subject: 'Testing EmailService',
      text: 'This email is the result of testing (emailService.spec.js)',
    };

    request
      .post('/api/mail')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(function (res) {
        assert(res.body.status === HttpStatus.statusServerError);
        assert(res.body.success === false);
        assert(res.body.value === HttpStatus.statusNameServerError);
        assert(res.body.error.includes('message is not valid'));
      })
      .end(done);
  });

  it('responds with success if message is defined - 1st way - one email', function (done) {
    const message = {
      from: 'fromEmail',
      to: 'toEmail',
      subject: 'Testing EmailService',
      text: 'This email is the result of testing (emailService.spec.js)',
    };

    const send = sandbox.stub(EmailService, 'send').resolves(true);
    request
      .post('/api/mail')
      .send({ message: message })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((res) => {
        const { status, success, value } = res.body;
        assert(status === 201);
        assert(success);
        assert(Object.keys(value).length === 0);
        assert(value.constructor === Object);
        sinon.assert.calledOnce(send);
        done();
      })
      .catch((err) => done(err));
  });

  it('responds with success if message is defined - 1st way - multiple emails', function (done) {
    const message = {
      from: 'fromEmail',
      to: 'toEmail',
      subject: 'Testing EmailService',
      text: 'This email is the result of testing (emailService.spec.js)',
    };

    const send = sandbox.stub(EmailService, 'send').resolves(true);
    request
      .post('/api/mail')
      .send({ message: message })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((res) => {
        const { status, success, value } = res.body;
        assert(status === 201);
        assert(success);
        assert(Object.keys(value).length === 0);
        assert(value.constructor === Object);
        sinon.assert.calledOnce(send);
        done();
      })
      .catch((err) => done(err));
  });

  it('responds with success if message is defined - 1st way - multiple emails via cc', function (done) {
    const message = {
      from: 'fromEmail',
      to: 'toEmail',
      subject: 'Testing EmailService',
      text: 'This email is the result of testing (emailService.spec.js)',
    };

    const send = sandbox.stub(EmailService, 'send').resolves(true);
    request
      .post('/api/mail')
      .send({ message: message })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((res) => {
        const { status, success, value } = res.body;
        assert(status === 201);
        assert(success);
        assert(Object.keys(value).length === 0);
        assert(value.constructor === Object);
        sinon.assert.calledOnce(send);
        done();
      })
      .catch((err) => done(err));
  });

  it('responds with success if message is defined - 1st way - multiple emails via bcc', function (done) {
    const message = {
      from: 'fromEmail',
      to: 'toEmail',
      subject: 'Testing EmailService',
      text: 'This email is the result of testing (emailService.spec.js)',
    };

    const send = sandbox.stub(EmailService, 'send').resolves(true);
    request
      .post('/api/mail')
      .send({ message: message })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((res) => {
        const { status, success, value } = res.body;
        assert(status === 201);
        assert(success);
        assert(Object.keys(value).length === 0);
        assert(value.constructor === Object);
        sinon.assert.calledOnce(send);
        done();
      })
      .catch((err) => done(err));
  });

  it('responds with success if message is defined - 2nd way - one email', function (done) {
    const message = {
      from: 'fromEmail',
      to: 'toEmail',
      subject: 'Testing EmailService',
      text: 'This email is the result of testing (emailService.spec.js)',
    };

    const send = sandbox.stub(EmailService, 'send').resolves(true);
    (async () => {
      try {
        const res = await request.post('/api/mail').send({ message: message });
        const { status, success, value } = res.body;
        assert(status === 201);
        assert(success);
        assert(Object.keys(value).length === 0);
        assert(value.constructor === Object);
        sinon.assert.calledOnce(send);
        done();
      } catch (err) {
        done(err);
      }
    })();
  });
});
