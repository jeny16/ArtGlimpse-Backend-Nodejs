const productService = require('../service/product.service');

/** POST /api/products */
async function createProductHandler(req, res, next) {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

/** GET /api/products */
async function listProductsHandler(req, res, next) {
  try {
    const products = await productService.listProducts(req.query);
    res.json(products);
  } catch (err) {
    next(err);
  }
}

/** GET /api/products/:id */
async function getProductHandler(req, res, next) {
  try {
    const prod = await productService.getProductById(req.params.id);
    if (!prod) return res.status(404).json({ message: 'Product not found' });
    res.json(prod);
  } catch (err) {
    next(err);
  }
}

/** PUT /api/products/:id */
async function updateProductHandler(req, res, next) {
  try {
    const updated = await productService.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/products/:id */
async function deleteProductHandler(req, res, next) {
  try {
    const deleted = await productService.deleteProduct(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createProductHandler,
  listProductsHandler,
  getProductHandler,
  updateProductHandler,
  deleteProductHandler
};
