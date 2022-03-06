
const Boom = require('boom');
const configs = require('./config.model');


exports.getConfigs = (filter = {},) => {
  try {
    return configs.findOne(filter);
  } catch (error) {
    console.log(error)
    return Boom.badImplementation('Something went wrong')
  }
}


exports.updateConfigs = (data = {}) => {
  try {
    return configs.findOneAndUpdate({}, data, { new: true });
  } catch (error) {
    return Boom.badImplementation('Something went wrong')
  }
}


