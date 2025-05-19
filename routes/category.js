
const express = require('express');
const router  = express.Router();
const { listCategoriesHandler } = require('../controllers/category.controller');

router.get('/', listCategoriesHandler);

module.exports = router;
