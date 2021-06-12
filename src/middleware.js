const { HttpStatus, HttpStatusResponse, ipAddress } = require('@1onlinesolution/dws-http');

exports.defaultErrorNotFoundHandler = () => {
  return (req, res, next) => {
    const error = new Error('Not Found');
    error.status = HttpStatus.statusNotFound;
    next(error);
  };
};

exports.defaultErrorHandler = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  /* eslint-disable no-unused-vars */
  return (error, req, res, next) => {
    const ip = ipAddress(req);
    let errorObject = isProduction ? undefined : error;
    if (error.status === HttpStatus.statusNotFound) {
      return res.json(HttpStatusResponse.notFound({ message: `${req.originalUrl} not found` }, errorObject, ip));
    } else if (error.code && error.code === 'EBADCSRFTOKEN') {
      const message = 'CSRF token mismatch';
      return res.json(HttpStatusResponse.forbidden({ message: `${HttpStatus.statusNameForbidden} - ${message}` }, errorObject, ip));
    }

    return res.json(HttpStatusResponse.serverError({ message: `${HttpStatus.statusNameServerError}` }, errorObject, ip));
  };
  /* eslint-enable no-unused-vars */
};
