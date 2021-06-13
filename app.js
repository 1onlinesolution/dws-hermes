const { HttpStatusResponse } = require('@1onlinesolution/dws-http');
const ExpressApplication = require('@1onlinesolution/dws-express-app/lib/expressApplication');
const env = require('./src/env');

const express = new ExpressApplication({
  isApi: true,
  domain: env.appName,
  appDirName: __dirname,
  useBodyParser: true,
  useHelmet: true,
  useCors: true,
  corsOptions: env.corsOptions,
  bodyParserOptions: { json: true, jsonLimit: env.bodyParser.jsonLimit },
});

// Routes
require('./src/routes/mainRouter')(express);
require('./src/routes/mailRouter')(express);

module.exports = express;
