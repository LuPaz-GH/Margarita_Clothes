const bcrypt = require('bcryptjs')
const prisma = require('../prismaClient')

function toSafeUser(user) {
  const { passwordHash, ...safeUser } = user
  return safeUser
}

async function listStaff() {
  const users = await prisma.user.findMany({
    where: { role: { in: ['EMPLEADO', 'ADMIN'] } },
    orderBy: { createdAt: 'desc' },
  })
  return users.map(toSafeUser)
}

async function createStaff({ name, email, password, role }) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    const error = new Error('Ya existe un usuario con ese email.')
    error.status = 409
    throw error
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role },
  })
  return toSafeUser(user)
}

async function update(id, { name, email, role, password }) {
  const passwordHash = password ? await bcrypt.hash(password, 10) : undefined

  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(email !== undefined ? { email } : {}),
      ...(role !== undefined ? { role } : {}),
      ...(passwordHash !== undefined ? { passwordHash } : {}),
    },
  })
  return toSafeUser(user)
}

async function setActive(id, active) {
  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { active },
  })
  return toSafeUser(user)
}

async function getById(id) {
  const user = await prisma.user.findUnique({ where: { id: Number(id) } })
  return user ? toSafeUser(user) : null
}

module.exports = { listStaff, createStaff, update, setActive, getById }
