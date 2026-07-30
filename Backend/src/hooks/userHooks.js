const activityLogService = require('../services/activityLogService')

async function afterStaffCreate(actingUser, newUser) {
  await activityLogService.record({
    userId: actingUser.id,
    action: 'CREAR_EMPLEADO',
    entityType: 'User',
    entityId: newUser.id,
    details: { name: newUser.name, email: newUser.email, role: newUser.role },
  })
}

async function afterStaffUpdate(actingUser, targetUser, changes) {
  await activityLogService.record({
    userId: actingUser.id,
    action: 'EDITAR_EMPLEADO',
    entityType: 'User',
    entityId: targetUser.id,
    details: changes,
  })
}

async function afterStaffActiveChange(actingUser, targetUser) {
  await activityLogService.record({
    userId: actingUser.id,
    action: targetUser.active ? 'ACTIVAR_EMPLEADO' : 'DESACTIVAR_EMPLEADO',
    entityType: 'User',
    entityId: targetUser.id,
    details: { name: targetUser.name, email: targetUser.email },
  })
}

module.exports = { afterStaffCreate, afterStaffUpdate, afterStaffActiveChange }
