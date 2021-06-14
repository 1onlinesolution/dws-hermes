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
require('./src/routers/mainRouter')(express);
require('./src/routers/mailRouter')(express);

module.exports = express;
