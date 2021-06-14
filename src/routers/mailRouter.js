const MailController = require('../controllers/mailController');

module.exports = (app) => {
  let routerInfo = app.addRouter('/api');
  const router = routerInfo.router;

  const controller = new MailController(app);
  router.post('/mail', controller.postMail);

  return router;
};
