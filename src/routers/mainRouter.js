const MainController = require('../controllers/mainController');

module.exports = (app) => {
  let routerInfo = app.addRouter('/');
  const router = routerInfo.router;

  const controller = new MainController(app);
  router.get('/', controller.home);

  return router;
};
