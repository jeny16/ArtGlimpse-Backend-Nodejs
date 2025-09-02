const express = require("express");
const router = express.Router();
const orderCtrl = require("../controllers/order.controller");

router.post("/", orderCtrl.createNewOrder);
router.get("/order/:orderId", orderCtrl.getOrderById);
router.get("/user/:userId", orderCtrl.getOrdersByUserId);
router.get("/seller/:sellerId", orderCtrl.getOrdersBySeller);
router.patch("/:orderId", orderCtrl.updateOrderById);

module.exports = router;
    