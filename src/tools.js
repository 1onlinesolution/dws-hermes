const colors = require('colors/safe');

function requireFromEnv(key, exitIfUndefined = true) {
  const value = process.env[key.toString()];

  if (typeof value === 'undefined' && exitIfUndefined) {
    // eslint-disable-next-line no-console
    console.error(`${colors.red('[APP ERROR] Missing env variable:')} ${colors.green(key)}`);

    return process.exit(1);
  }

  return value;
}

module.exports = {
  requireFromEnv,
};
