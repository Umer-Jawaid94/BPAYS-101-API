const Iron = require('@hapi/iron');
const verify = require('./verify');
const User = require('../features/user/user.model');

exports.getLoginData = function (user, expiry) {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {
        _id: user._doc._id,
        username: user._doc.username,
        role: user._doc.role,
        name: user._doc.name
      };
      // const hash = crypto.createHash('md5').update(userAgent).digest('hex');
      const seal = await Iron.seal(userData, process.env.SEAL_PASSWORD, Iron.defaults);
      const token = verify.getToken({ data: seal }, expiry || `30 days`);
      User.findById(userData._id)
        .exec((err, foundUser) => {
          if (err) {
            return reject(err);
          } else {
            if (!foundUser) {
              return reject(err);
            } else {
              let data = {
                token: token,
                data: userData,
              };
              return resolve(data);
            }
          }
        });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      return reject(err);
    }
  })
};