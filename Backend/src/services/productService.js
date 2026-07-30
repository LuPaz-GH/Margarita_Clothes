const prisma = require('../prismaClient')

const auditInclude = {
  createdBy: { select: { id: true, name: true } },
  updatedBy: { select: { id: true, name: true } },
  deletedBy: { select: { id: true, name: true } },
}

async function listActive({ audience, search } = {}) {
  return prisma.product.findMany({
    where: {
      deletedAt: null,
      ...(audience ? { audience: audience.toUpperCase() } : {}),
      ...(search ? { name: { contains: search } } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })
}

async function listAll() {
  return prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: auditInclude,
  })
}

async function getById(id) {
  return prisma.product.findUnique({ where: { id: Number(id) } })
}

async function create(data, userId) {
  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      audience: data.audience.toUpperCase(),
      image: data.image,
      stock: data.stock ?? 0,
      createdById: userId,
      updatedById: userId,
    },
  })
}

async function update(id, data, userId) {
  return prisma.product.update({
    where: { id: Number(id) },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.price !== undefined ? { price: data.price } : {}),
      ...(data.category !== undefined ? { category: data.category } : {}),
      ...(data.audience !== undefined ? { audience: data.audience.toUpperCase() } : {}),
      ...(data.image !== undefined ? { image: data.image } : {}),
      ...(data.stock !== undefined ? { stock: data.stock } : {}),
      updatedById: userId,
    },
  })
}

async function softDelete(id, userId) {
  return prisma.product.update({
    where: { id: Number(id) },
    data: { deletedAt: new Date(), deletedById: userId },
  })
}

module.exports = { listActive, listAll, getById, create, update, softDelete }
