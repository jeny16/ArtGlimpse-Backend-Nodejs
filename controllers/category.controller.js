const categoryService = require('../service/category.service');

async function listCategoriesHandler(req, res, next) {
  try {
    const categories = await categoryService.listCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listCategoriesHandler,
};
