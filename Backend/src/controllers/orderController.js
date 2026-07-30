const orderService = require('../services/orderService')
const orderHooks = require('../hooks/orderHooks')

const VALID_STATUSES = [
  'PENDIENTE',
  'PAGADO',
  'ENVIADO',
  'ENTREGADO',
  'DEVUELTO',
  'CANCELADO',
]

async function create(req, res, next) {
  try {
    const { items, paymentMethod, shippingAddress } = req.body
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'El pedido necesita al menos un producto.' })
    }

    const order = await orderService.create({
      userId: req.user.id,
      items,
      paymentMethod,
      shippingAddress,
    })
    res.status(201).json(order)
  } catch (error) {
    next(error)
  }
}

async function listMine(req, res, next) {
  try {
    const orders = await orderService.listMine(req.user.id)
    res.json(orders)
  } catch (error) {
    next(error)
  }
}

async function listAll(req, res, next) {
  try {
    const orders = await orderService.listAll()
    res.json(orders)
  } catch (error) {
    next(error)
  }
}

async function updateStatus(req, res, next) {
  try {
    const { status } = req.body
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Estado inválido.' })
    }

    const existing = await orderService.getById(req.params.id)
    if (!existing) {
      return res.status(404).json({ error: 'Pedido no encontrado.' })
    }

    const order = await orderService.updateStatus(req.params.id, status)
    await orderHooks.afterStatusChange(req.user, order, existing.status)
    res.json(order)
  } catch (error) {
    next(error)
  }
}

module.exports = { create, listMine, listAll, updateStatus }
