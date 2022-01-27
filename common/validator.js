const Boom = require('boom')

module.exports = function (schema) {
  return function (req, res, next) {
    try {
      let incomingData = {
        query: req.query,
        params: req.params,
        body: req.body
      };
      let { error, value } = schema.validate(incomingData, { stripUnknown: true });
      if (error) {
        const message = error.message.replace(/"/g, '');
        return next(Boom.badData('VALIDATION_ERROR', message));
      }
      req.body = value.body;
      req.params = value.params;
      req.query = value.query;
      next();
    } catch (error) {
      return next(Boom.badData('VALIDATION_ERROR', error));
    }
  };
};