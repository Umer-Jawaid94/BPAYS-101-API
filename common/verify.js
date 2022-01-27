const jwt = require('jsonwebtoken');
const Boom = require('boom');
const Iron = require('@hapi/iron');

exports.getToken = function (user, expiresIn) {
  return jwt.sign(user, process.env.SECRET_KEY, {
    expiresIn: expiresIn || 3600
  });
};

exports.user = function (req, res, next) {
  const token = req.body.token || req.query.token || req.headers[`x-access-token`];
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, async function (err, decoded) {
      if (err) {
        return next(Boom.unauthorized('jwt error'));
      } else {
        try {
          // const hash = crypto.createHash('md5').update(req.headers['user-agent']).digest('hex');
          const unsealed = await Iron.unseal(decoded.data, process.env.SEAL_PASSWORD, Iron.defaults);
          req._user = unsealed;
          next();
        } catch (error) {
          return next(Boom.unauthorized('seal error'));
        }
      }
    });
  } else {
    return next(Boom.forbidden('no token'));
  }
};