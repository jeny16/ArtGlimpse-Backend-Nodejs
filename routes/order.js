// routes/order.js
const express = require("express");
const { createNewOrder, getOrdersByUserId } = require("../controllers/order.controller");

const router = express.Router();

// POST /orders
router.post("/", createNewOrder);

// GET /orders/:userId
router.get("/:userId", getOrdersByUserId);

module.exports = router;
