const env = require('./src/env');
const express = require('./app');

express.listen(env.port, () => {
  console.log('Listening at port:', env.port);
});

module.exports = express.app;