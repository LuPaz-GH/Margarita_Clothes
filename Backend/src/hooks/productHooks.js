const activityLogService = require('../services/activityLogService')

async function afterProductCreate(user, product) {
  await activityLogService.record({
    userId: user.id,
    action: 'CREAR_PRODUCTO',
    entityType: 'Product',
    entityId: product.id,
    details: { name: product.name },
  })
}

async function afterProductUpdate(user, product, changes) {
  await activityLogService.record({
    userId: user.id,
    action: 'EDITAR_PRODUCTO',
    entityType: 'Product',
    entityId: product.id,
    details: changes,
  })
}

async function afterProductDelete(user, product) {
  await activityLogService.record({
    userId: user.id,
    action: 'ELIMINAR_PRODUCTO',
    entityType: 'Product',
    entityId: product.id,
    details: { name: product.name },
  })
}

module.exports = { afterProductCreate, afterProductUpdate, afterProductDelete }
