const Product = require('../models/product.model');

async function createProduct(data) {
  const product = new Product(data);
  return await product.save();
}

async function getProductById(id) {
  return await Product.findById(id);
}

async function updateProduct(id, data) {
  return await Product.findByIdAndUpdate(id, data, { new: true });
}

async function deleteProduct(id) {
  return await Product.findByIdAndDelete(id);
}

async function listProducts(filter = {}) {
  return await Product.find(filter);
}

module.exports = {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  listProducts
};