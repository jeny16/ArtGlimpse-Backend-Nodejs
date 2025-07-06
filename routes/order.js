// routes/order.js
const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/order.controller');

router.post('/',                orderCtrl.createNewOrder);
router.get('/user/:userId',     orderCtrl.getOrdersByUserId);
router.get('/seller/:sellerId', orderCtrl.getOrdersBySeller);

module.exports = router;
