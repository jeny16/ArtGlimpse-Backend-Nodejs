const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

router.post('/', productController.createProductHandler);
router.get('/', productController.listProductsHandler);
router.get('/seller/:sellerId', productController.getProductsBySellerHandler);
router.get('/:id', productController.getProductHandler);
router.put('/:id', productController.updateProductHandler);
router.delete('/:id', productController.deleteProductHandler);


module.exports = router;

