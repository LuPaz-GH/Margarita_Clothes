const activityLogService = require('../services/activityLogService')

async function afterStatusChange(user, order, previousStatus) {
  await activityLogService.record({
    userId: user.id,
    action: 'CAMBIAR_ESTADO_PEDIDO',
    entityType: 'Order',
    entityId: order.id,
    details: { from: previousStatus, to: order.status },
  })
}

module.exports = { afterStatusChange }
