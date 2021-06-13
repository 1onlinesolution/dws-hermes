const ControllerBase = require('@1onlinesolution/dws-express-app/lib/controllers/controllerBase');
const { EmailService } = require('@1onlinesolution/dws-mail');
const { HttpStatusResponse, ipAddress } = require('@1onlinesolution/dws-http');
const env = require('../env');

const isProduction = process.env.NODE_ENV === 'production';

class MailController extends ControllerBase {
  constructor(expressApp) {
    super(expressApp);
  }

  async postMail(req, res) {
    const ip = ipAddress(req);

    const { message } = req.body;
    if (!message) {
      return res.json(HttpStatusResponse.serverError(undefined, 'message is not valid', ip));
    }

    try {
      const info = await EmailService.send({
        message,
        email_host: env.email.host,
        email_username: env.email.username,
        email_password: env.email.password,
      });
      const { err, accepted, rejected, messageId, response, envelope } = info;
      const value = {
        accepted,
        rejected,
        messageId,
        response,
        envelope,
      };
      if (err) {
        return res.json(HttpStatusResponse.serverError(value, err, ip));
      }

      return res.json(HttpStatusResponse.created(value, undefined, ip));
    } catch (err) {
      console.log('*** Error', err);
      return res.json(HttpStatusResponse.serverError(undefined, isProduction ? err.message : err, ip));
    }
  }
}

module.exports = MailController;
