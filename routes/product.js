/* routes/product.routes.js */
const express = require('express');
const multer  = require('multer');
const {
  createProductHandler,
  listProductsHandler,
  getProductHandler,
  updateProductHandler,
  deleteProductHandler,
  getProductsBySellerHandler
} = require('../controllers/product.controller');

const upload = multer(); // memory storage
const router = express.Router();

// POST with multipart/form-data (files and fields)
router.post(
  '/', 
  upload.any(),           // accept any file fields (e.g. image_0, image_1...)
  createProductHandler
);

// Other product routes
router.get('/', listProductsHandler);
router.get('/seller/:sellerId', getProductsBySellerHandler);
router.get('/:id', getProductHandler);
router.put('/:id', express.json(), updateProductHandler); // JSON for updates
router.delete('/:id', deleteProductHandler);

module.exports = router;

