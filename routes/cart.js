const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.get('/:userId', cartController.getCart);
router.post('/:userId/add', cartController.addItem);
router.delete('/:userId/remove/:productId', cartController.removeItem);
router.delete('/:userId/clear', cartController.clearCart);
router.put("/:userId/:productId", cartController.updateItemQuantity);

module.exports = router;
