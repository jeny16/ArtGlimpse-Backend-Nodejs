const Category = require('../models/category.model.js');

async function listCategories() {
  return Category.find().sort({ name: 1 }).exec();
}

module.exports = {
  listCategories,
};
