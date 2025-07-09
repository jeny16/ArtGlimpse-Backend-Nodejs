const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

router.get("/:userId", cartController.getCartByUserId);
router.post("/:userId/add", cartController.addItemToCart);
router.put("/:userId/:productId", cartController.updateItemQuantity);
router.delete("/:userId/:productId", cartController.removeItemFromCart);
router.delete("/:userId", cartController.clearCartController);

module.exports = router;
