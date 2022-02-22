
const activity = require('./paymentActivities.model');

exports.createActivity = (data) => {
  try {
    return activity.create(data);
  } catch (error) {
    return Boom.badImplementation('Something went wrong')
  }
}

exports.getAllActivities = (filter = {}) => {
  try {
    return activity.find(filter).sort({createdAt:-1}).populate('creator user');
  } catch (error) {
    return Boom.badImplementation('Something went wrong')
  }
}


