const productService = require('../services/productService')
const productHooks = require('../hooks/productHooks')

async function list(req, res, next) {
  try {
    const { audience, search } = req.query
    const products = await productService.listActive({ audience, search })
    res.json(products)
  } catch (error) {
    next(error)
  }
}

async function listAll(req, res, next) {
  try {
    const products = await productService.listAll()
    res.json(products)
  } catch (error) {
    next(error)
  }
}

async function getOne(req, res, next) {
  try {
    const product = await productService.getById(req.params.id)
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' })
    }
    res.json(product)
  } catch (error) {
    next(error)
  }
}

async function create(req, res, next) {
  try {
    const { name, price, category, audience } = req.body
    if (!name || price === undefined || !category || !audience) {
      return res
        .status(400)
        .json({ error: 'name, price, category y audience son obligatorios.' })
    }

    const product = await productService.create(req.body, req.user.id)
    await productHooks.afterProductCreate(req.user, product)
    res.status(201).json(product)
  } catch (error) {
    next(error)
  }
}

async function update(req, res, next) {
  try {
    const existing = await productService.getById(req.params.id)
    if (!existing) {
      return res.status(404).json({ error: 'Producto no encontrado.' })
    }

    const product = await productService.update(req.params.id, req.body, req.user.id)
    await productHooks.afterProductUpdate(req.user, product, req.body)
    res.json(product)
  } catch (error) {
    next(error)
  }
}

async function remove(req, res, next) {
  try {
    const existing = await productService.getById(req.params.id)
    if (!existing) {
      return res.status(404).json({ error: 'Producto no encontrado.' })
    }

    const product = await productService.softDelete(req.params.id, req.user.id)
    await productHooks.afterProductDelete(req.user, product)
    res.json({ message: 'Producto eliminado.', product })
  } catch (error) {
    next(error)
  }
}

module.exports = { list, listAll, getOne, create, update, remove }
