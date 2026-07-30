const prisma = require('../prismaClient')

async function create({ userId, items, paymentMethod, shippingAddress }) {
  const productIds = items.map((item) => item.productId)
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } })

  const orderItemsData = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)
    if (!product) {
      const error = new Error(`Producto ${item.productId} no encontrado.`)
      error.status = 400
      throw error
    }
    return {
      productId: product.id,
      quantity: item.quantity,
      unitPrice: product.price,
    }
  })

  const total = orderItemsData.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0,
  )

  return prisma.order.create({
    data: {
      userId,
      total,
      paymentMethod,
      shippingAddress,
      items: { create: orderItemsData },
    },
    include: { items: { include: { product: true } } },
  })
}

async function listMine(userId) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } } },
  })
}

async function listAll() {
  return prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: { include: { product: true } },
      user: { select: { id: true, name: true, email: true } },
    },
  })
}

async function getById(id) {
  return prisma.order.findUnique({
    where: { id: Number(id) },
    include: { items: { include: { product: true } }, user: true },
  })
}

async function updateStatus(id, status) {
  return prisma.order.update({ where: { id: Number(id) }, data: { status } })
}

module.exports = { create, listMine, listAll, getById, updateStatus }
