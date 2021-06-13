const ControllerBase = require('@1onlinesolution/dws-express-app/lib/controllers/controllerBase');
const { EmailService } = require('@1onlinesolution/dws-mail');
const { HttpStatusResponse, ipAddress } = require('@1onlinesolution/dws-http');
const env = require('../env');

class MainController extends ControllerBase {
  constructor(expressApp) {
    super(expressApp);
  }

  home(req, res, next) {
    if (req.url === '/') {
      return res.json(HttpStatusResponse.ok({ message: `Welcome to ${env.appName} - OK` }));
    }

    next();
  }
}

module.exports = MainController;
