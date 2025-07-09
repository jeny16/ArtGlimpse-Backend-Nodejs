const mongoose = require("mongoose");
const Order = require("../models/order.model");

module.exports = {
  
  async createOrder(orderData) {
    const { userId, items, totalAmount, shippingAddress, paymentInfo } = orderData;

    // Validate required fields
    if (
      !userId ||
      !mongoose.Types.ObjectId.isValid(userId) ||
      !Array.isArray(items) ||
      items.length === 0 ||
      typeof totalAmount !== "number" ||
      !shippingAddress
    ) {
      const err = new Error("Missing or invalid required fields");
      err.status = 400;
      throw err;
    }

    // Build items array using productData provided from client
    const itemsWithSeller = items.map((item) => {
      const prodData = item.productData || {};
      let prodId = prodData._id || item.productId;

      // Extract nested _id if it's an object
      if (prodId && typeof prodId === 'object' && prodId._id) {
        prodId = prodId._id;
      }
      // Coerce to string if still an object
      if (typeof prodId !== 'string') {
        prodId = String(prodId);
      }

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(prodId)) {
        throw new Error(`Invalid productId: ${JSON.stringify(prodId)}`);
      }

      const sellerId = prodData.seller;
      return {
        productId: new mongoose.Types.ObjectId(prodId),
        quantity: item.quantity,
        price: Number(prodData.price) || 0,
        seller:
          sellerId && mongoose.Types.ObjectId.isValid(sellerId)
            ? new mongoose.Types.ObjectId(sellerId)
            : undefined,
      };
    });

    // Create and save order
    const newOrder = new Order({
      userId: new mongoose.Types.ObjectId(userId),
      items: itemsWithSeller,
      totalAmount,
      shippingAddress,
      paymentInfo: {
        razorpayPaymentId: paymentInfo?.razorpayPaymentId || null,
      },
      status: 'New',
    });

    return await newOrder.save();
  },

  async getOrdersByUser(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const err = new Error("Invalid userId format");
      err.status = 400;
      throw err;
    }
    return await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate({ path: "items.productId" });
  },

  async getOrdersBySeller(sellerId) {
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      const err = new Error("Invalid sellerId format");
      err.status = 400;
      throw err;
    }
    return await Order.find({ "items.seller": sellerId })
      .sort({ createdAt: -1 })
      .populate({ path: "items.productId", model: "Product" })
      .lean();
  },
};
