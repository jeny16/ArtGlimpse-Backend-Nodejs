// backend/controllers/paymentController.js
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Order   = require("../models/order.model");
const Payment = require("../models/payment.model"); // you must create this

const razor = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * POST /api/payments/create-order
 * body: { orderId: "<your internal order _id>", amount: 123.45 }
 */
exports.createOrder = async (req, res) => {
  const { orderId, amount, currency = "INR" } = req.body;
  try {
    // 1) create Razorpay order
    const razorOrder = await razor.orders.create({
      amount: Math.round(amount * 100), // paise
      currency,
      receipt: orderId,
      payment_capture: 1,
    });

    // 2) record in DB
    await Payment.create({
      orderId,               // your internal order id
      razorpayOrderId: razorOrder.id,
      amount: razorOrder.amount,
      status: "Created",
    });

    return res.status(200).json({
      success: true,
      data: {
        key: process.env.RAZORPAY_KEY_ID,
        order: razorOrder,
      },
    });
  }catch (err) {
  console.error("❌ Razorpay Order Creation Error:");
  console.error("Message:", err?.message || "No message");
  console.error("Stack:", err?.stack || "No stack");
  console.error("Full Error Object:", err); // this logs everything
  return res.status(500).json({
    success: false,
    message: "Order creation failed",
    error: err?.message || err,
  });
}
}

/**
 * POST /api/payments/verify
 * body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * Called by your frontend handler (or as a webhook endpoint)
 */
exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // 1) Verify signature
  const generated = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated !== razorpay_signature) {
    return res.status(400).json({ success: false, valid: false, message: "Invalid signature" });
  }

  // 2) Update your Payment record
  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    {
      razorpayPaymentId: razorpay_payment_id,
      status: "Paid",
      paidAt: new Date(),
    },
    { new: true }
  );
  if (!payment) {
    return res.status(404).json({ success: false, message: "Payment record not found" });
  }

  // 3) Update your Order record
  await Order.findByIdAndUpdate(payment.orderId, {
    paymentStatus: "Paid",
    paymentType:    "razorpay",
    paidAt:         new Date(),
    status: 'New',   // or whatever next workflow step you want

  });

  return res.json({ success: true, valid: true });
};

/**
 * GET /api/payments/status/:orderId
 * Returns the current payment status for an internal order
 */
exports.getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    return res.json({ success: true, status: payment.status });
  } catch (err) {
    console.error("Error fetching payment status", err);
    return res.status(500).json({ success: false, message: "Could not fetch status" });
  }
};
