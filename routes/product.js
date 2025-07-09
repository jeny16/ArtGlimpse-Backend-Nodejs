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

router.post(
  '/', 
  upload.any(),           
  createProductHandler
);


router.get('/', listProductsHandler);
router.get('/seller/:sellerId', getProductsBySellerHandler);
router.get('/:id', getProductHandler);
router.patch('/:id', express.json(), updateProductHandler); 
router.delete('/:id', deleteProductHandler);

module.exports = router;

