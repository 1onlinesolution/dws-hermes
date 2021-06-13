const ControllerBase = require('@1onlinesolution/dws-express-app/lib/controllers/controllerBase');
const EmailService = require('@1onlinesolution/dws-mail/lib/emailService');
const HttpStatusResponse = require('@1onlinesolution/dws-http/lib/httpStatusResponse');
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
