const env = require('./src/env');
const app = require('./app');

app.listen(env.port, () => {
  console.log('Listening at port:', env.port);
});
