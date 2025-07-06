const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

// Get cart by user ID
router.get("/:userId", cartController.getCartByUserId);

// Add item to cart
router.post("/:userId/add", cartController.addItemToCart);

// Update item quantity in cart (RESTful: use userId and productId in URL)
router.put("/:userId/:productId", cartController.updateItemQuantity);

// Remove item from cart (RESTful: use userId and productId in URL)
router.delete("/:userId/:productId", cartController.removeItemFromCart);

module.exports = router;
