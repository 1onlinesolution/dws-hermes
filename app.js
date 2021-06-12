const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { HttpStatusResponse } = require('@1onlinesolution/dws-http');
const env = require('./src/env');
const { defaultErrorNotFoundHandler, defaultErrorHandler } = require('./src/middleware');
const routes = require('./src/router');

const app = express();

app.use(
  helmet({
    frameguard: {
      action: 'deny',
    },
  }),
);
app.use(cors(env.corsOptions));
app.use(bodyParser.urlencoded({ extended: false, limit: env.bodyParser.urlencodedLimit }));
app.use(bodyParser.json({ limit: env.bodyParser.jsonLimit }));

app.use('/', (req, res, next) => {
  if (req.url === '/') {
    return res.json(HttpStatusResponse.ok({ message: `Welcome to ${env.appName} - OK` }));
  }

  next();
});

app.use('/api', routes);
app.use(defaultErrorNotFoundHandler());
app.use(defaultErrorHandler());

module.exports = app;
