const Boom = require("boom")
const { getConfigs, updateConfigs } = require("./config.controller")

exports.getConfigs = async (req, res, next) => {
  try {
    const data = await getConfigs()
    return res.json({
      data
    })
  } catch (error) {
    return next(Boom.badImplementation(error))
  }
}

exports.updateConfigs = async (req, res, next) => {
  try {
    const data = await updateConfigs({ ...req.body })
    return res.json({
      data
    })
  } catch (error) {
    return next(Boom.badImplementation(error))
  }
}