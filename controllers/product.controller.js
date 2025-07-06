const productService = require('../service/product.service');
const Category     = require('../models/category.model');
// const Product        = require('../models/product.model'); 

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
    const filter = {};

    // ■ Only apply “category” filter if the client actually sent something non-empty
    if (typeof req.query.categories === 'string' && req.query.categories.trim() !== '') {
      const names = req.query.categories.split(',').map(s => s.trim()).filter(Boolean);
      if (names.length) {
        const cats = await Category.find({ name: { $in: names } }).select('_id');
        filter.category = { $in: cats.map(c => c._id) };
      }
    }

    // ■ Price
    if (req.query.minPrice) filter.price = { ...filter.price, $gte: Number(req.query.minPrice) };
    if (req.query.maxPrice) filter.price = { ...filter.price, $lte: Number(req.query.maxPrice) };

    // ■ In-stock
    if (req.query.inStockOnly === 'true') {
      filter.stock = { $gt: 0 };
    }

    // ■ Discount
    if (typeof req.query.discount === 'string' && req.query.discount.trim() !== '') {
      const levels = req.query.discount.split(',').map(v => Number(v));
      filter.percentage_Discount = { $in: levels };
    }

    // ■ Countries
    if (typeof req.query.countries === 'string' && req.query.countries.trim() !== '') {
      const list = req.query.countries.split(',').map(c => c.trim()).filter(Boolean);
      filter.countries_Available = { $in: list };
    }

    // ■ Text search
    if (req.query.search && req.query.search.trim() !== '') {
      filter.name = { $regex: req.query.search.trim(), $options: 'i' };
    }

    // ■ Now hand off to service (which does .find(filter).populate('category')…)
    const result = await productService.listProducts(filter, {
      sortBy: req.query.sortBy,
      page:   Number(req.query.page)   || 1,
      limit:  Number(req.query.limit)  || 16,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

/** GET /api/products/:id */
async function getProductHandler(req, res, next) {
  try {
    console.log("consoling:::", req)
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

const mongoose = require('mongoose');
const Product  = require('../models/product.model');

async function getProductsBySellerHandler(req, res, next) {
  try {
    const { sellerId } = req.params;
    if (!sellerId) {
      return res.status(400).json({ message: 'sellerId path parameter is required' });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ message: 'Invalid sellerId format' });
    }

    // Fetch products
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
