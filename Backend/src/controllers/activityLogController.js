const activityLogService = require('../services/activityLogService')

async function list(req, res, next) {
  try {
    const logs = await activityLogService.list()
    res.json(logs)
  } catch (error) {
    next(error)
  }
}

module.exports = { list }
