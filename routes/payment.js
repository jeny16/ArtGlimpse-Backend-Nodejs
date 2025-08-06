// backend/routes/paymentRoutes.js
const express = require('express');
const {
  createOrder,
  verifyPayment,
  getPaymentStatus,
} = require('../controllers/payment.controller');

const router = express.Router();

// 1) Create a Razorpay order and persist a Payment record
//    Request body: { orderId: "<your internal order _id>", amount: 123.45 }
router.post('/create-order', createOrder);

// 2) Verify a completed payment’s signature
//    Request body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
router.post('/verify', verifyPayment);

// 3) Poll payment status for an internal order
//    GET /api/payments/status/:orderId
router.get('/status/:orderId', getPaymentStatus);

module.exports = router;
