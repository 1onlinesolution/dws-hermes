const { requireFromEnv } = require('./tools');

const BODYPARSER_URLENCODED_LIMIT = requireFromEnv('BODYPARSER_URLENCODED_LIMIT', false) || '1mb';
const BODYPARSER_JSON_LIMIT = requireFromEnv('BODYPARSER_JSON_LIMIT', false) || '1mb';

const EMAIL_HOST = requireFromEnv('EMAIL_HOST');
const EMAIL_USERNAME = requireFromEnv('EMAIL_USERNAME');
const EMAIL_PASSWORD = requireFromEnv('EMAIL_PASSWORD');


const CORS_ORIGIN = requireFromEnv('CORS_ORIGIN', false);
const corsOptions = {};
if (typeof CORS_ORIGIN !== 'undefined' && CORS_ORIGIN !== '') {
  corsOptions.origin = CORS_ORIGIN;
}


module.exports = {
  appName: requireFromEnv('APP_NAME', false) || 'Hermes Service',
  env: requireFromEnv('NODE_ENV'),
  port: parseInt(requireFromEnv('PORT', false) || 7001, 10),
  corsOptions: corsOptions,
  bodyParser: {
    urlencodedLimit: BODYPARSER_URLENCODED_LIMIT,
    jsonLimit: BODYPARSER_JSON_LIMIT,
  },
  email: {
    host: EMAIL_HOST,
    userName: EMAIL_USERNAME,
    password: EMAIL_PASSWORD,
  },
  // version: packageJson.version,
};
