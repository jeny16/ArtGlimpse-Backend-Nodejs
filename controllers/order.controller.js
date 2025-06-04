// controllers/order.controller.js
const Order = require("../models/order.model");

exports.createNewOrder = async (req, res, next) => {
  try {
    const {
      userId,
      items,
      totalAmount,
      shippingAddress,
      paymentInfo
    } = req.body;

    if (!userId || !Array.isArray(items) || items.length === 0 || !totalAmount || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (userId, items, totalAmount, shippingAddress)."
      });
    }

    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      shippingAddress,
      paymentInfo: {
        razorpayPaymentId: paymentInfo?.razorpayPaymentId ?? null
      },
      status: "Pending"
    });

    await newOrder.save();

    return res.status(201).json({
      success: true,
      order: newOrder
    });
  } catch (err) {
    console.error("Error in createNewOrder:", err);
    return res.status(500).json({
      success: false,
      message: "Could not create order."
    });
  }
};

exports.getOrdersByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId parameter" });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).populate({
        path: "items.productId",
      });

    return res.status(200).json({
      success: true,
      orders
    });
  } catch (err) {
    console.error("Error in getOrdersByUserId:", err);
    return res.status(500).json({
      success: false,
      message: "Could not fetch orders."
    });
  }
};

