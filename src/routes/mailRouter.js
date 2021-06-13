const MailController = require('../controllers/mailController');

const apiRoot = '/api';

module.exports = (app) => {
  let routerInfo = app.addRouter(apiRoot);
  const router = routerInfo.router;

  const controller = new MailController(app);
  router.post('/mail', controller.postMail);

  return router;
};
