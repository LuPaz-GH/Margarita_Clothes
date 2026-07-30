const prisma = require('../prismaClient')

async function record({ userId, action, entityType, entityId, details }) {
  return prisma.activityLog.create({
    data: {
      userId,
      action,
      entityType,
      entityId,
      details: details ? JSON.stringify(details) : null,
    },
  })
}

async function list() {
  return prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
  })
}

module.exports = { record, list }
