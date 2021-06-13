const MainController = require('../controllers/mainController');

const root = '/';

module.exports = (app) => {
  let routerInfo = app.addRouter(root);
  const router = routerInfo.router;

  const controller = new MainController(app);
  router.get('/', controller.home);

  return router;
};
