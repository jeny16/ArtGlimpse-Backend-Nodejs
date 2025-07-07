// controllers/product.controller.js
const mongoose = require('mongoose');
const productService = require('../service/product.service');
const Category       = require('../models/category.model');
const Product        = require('../models/product.model');

/** POST /api/products */
async function createProductHandler(req, res, next) {
  try {
    const sellerId = req.query.sellerId;
    if (!sellerId) {
      return res.status(400).json({ message: 'Missing sellerId in query' });
    }

    // At this point multer.none() has populated req.body
    console.log("Data received to create product:", req.body);

    // Normalize array‐like fields
    let {
      materials_Made,
      countries_Available,
      tags,
      ...rest
    } = req.body;

    if (typeof materials_Made === 'string') {
      materials_Made = materials_Made.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (typeof countries_Available === 'string') {
      countries_Available = countries_Available.split(',').map(s => s.trim()).filter(Boolean);
    }
    // Multer will give you either an array (if multiple append) or string
    if (typeof tags === 'string') {
      tags = tags.split(',').map(s => s.trim()).filter(Boolean);
    }

    const data = {
      ...rest,
      materials_Made,
      countries_Available,
      tags,
      seller: sellerId,
      images: []  // you’ll hook up S3 upload later
    };

    const product = await productService.createProduct(data);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

/** GET /api/products */
async function listProductsHandler(req, res, next) {
  try {
    const filter = {};

    // ... same logic as before ...

    const result = await productService.listProducts(filter, {
      sortBy: req.query.sortBy,
      page:   Number(req.query.page)  || 1,
      limit:  Number(req.query.limit) || 16,
    });

    res.json(result);
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

/** GET /api/products/seller/:sellerId */
async function getProductsBySellerHandler(req, res, next) {
  try {
    const { sellerId } = req.params;
    if (!sellerId) {
      return res.status(400).json({ message: 'sellerId path parameter is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ message: 'Invalid sellerId format' });
    }
    const products = await Product.find({ seller: sellerId });
    return res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createProductHandler,
  listProductsHandler,
  getProductHandler,
  updateProductHandler,
  deleteProductHandler,
  getProductsBySellerHandler
};
