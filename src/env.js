const { getenv } = require('@1onlinesolution/dws-utils');

const BODYPARSER_URLENCODED_LIMIT = getenv('BODYPARSER_URLENCODED_LIMIT', false) || '1mb';
const BODYPARSER_JSON_LIMIT = getenv('BODYPARSER_JSON_LIMIT', false) || '1mb';

const EMAIL_HOST = getenv('EMAIL_HOST');
const EMAIL_USERNAME = getenv('EMAIL_USERNAME');
const EMAIL_USERNAME2 = getenv('EMAIL_USERNAME2');
const EMAIL_PASSWORD = getenv('EMAIL_PASSWORD');


const CORS_ORIGIN = getenv('CORS_ORIGIN', false);
const corsOptions = {};
if (typeof CORS_ORIGIN !== 'undefined' && CORS_ORIGIN !== '') {
  corsOptions.origin = CORS_ORIGIN;
}


module.exports = {
  appName: getenv('APP_NAME', false) || 'Hermes Service',
  env: getenv('NODE_ENV'),
  port: parseInt(getenv('PORT', false) || 7001, 10),
  corsOptions: corsOptions,
  bodyParser: {
    urlencodedLimit: BODYPARSER_URLENCODED_LIMIT,
    jsonLimit: BODYPARSER_JSON_LIMIT,
  },
  email: {
    host: EMAIL_HOST,
    username: EMAIL_USERNAME,
    password: EMAIL_PASSWORD,
    username2: EMAIL_USERNAME2,
  },
  // version: packageJson.version,
};
