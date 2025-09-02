const Product = require('../models/product.model');

async function listProducts(filter = {}, { sortBy, page, limit } = {}) {
  const query = Product.find(filter).populate('category');

  // Sorting
  if (sortBy) {
    const [field, dir] = sortBy.split(':');
    query.sort({ [field]: dir === 'desc' ? -1 : 1 });
  }

  // Pagination
  const skip = (page - 1) * limit;
  query.skip(skip).limit(limit);

  // Execute both data + count
  const [docs, count] = await Promise.all([
    query.exec(),
    Product.countDocuments(filter),
  ]);

  return {
    data: docs,
    pagination: {
      total: count,
      limit,
      page,
      pages: Math.ceil(count / limit),
    },
  };
}

async function createProduct(data) {
  const p = new Product(data);
  return await p.save();
}

async function getProductById(id) {
  return await Product
    .findById(id)
    .populate('category')
    .exec();
}

async function updateProduct(id, data) {
  return await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

async function deleteProduct(id) {
  return await Product.findByIdAndDelete(id);
}

module.exports = {
  listProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct
};
