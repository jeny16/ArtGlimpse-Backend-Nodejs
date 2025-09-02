const mongoose = require("mongoose");
const Order = require("../models/order.model");

const STATUS_FLOW = ["New", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

function isValidStatusTransition(currentStatus, newStatus) {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);
  const newIndex = STATUS_FLOW.indexOf(newStatus);
  return newIndex > currentIndex; // only allow forward
}

module.exports = {
  async createOrder(orderData) {
    const {
      userId,
      items,
      totalAmount,
      shippingAddress,
      paymentInfo,
      paymentType,
      paymentStatus,
    } = orderData;

    // 1️⃣ Validate
    if (
      !userId ||
      !mongoose.Types.ObjectId.isValid(userId) ||
      !Array.isArray(items) ||
      items.length === 0 ||
      typeof totalAmount !== "number" ||
      !shippingAddress ||
      !["cashOnDelivery", "razorpay"].includes(paymentType) ||
      !["Pending", "Paid", "Failed", "Refunded", "Cancelled"].includes(
        paymentStatus
      )
    ) {
      const err = new Error("Missing or invalid required fields");
      err.status = 400;
      throw err;
    }

    // 2️⃣ Shape items
    const itemsWithSeller = items.map((item) => {
      const prod = item.productData || {};
      let prodId = prod._id || item.productId;
      if (prodId && typeof prodId === "object" && prodId._id) {
        prodId = prodId._id;
      }
      if (typeof prodId !== "string") prodId = String(prodId);
      if (!mongoose.Types.ObjectId.isValid(prodId)) {
        throw new Error(`Invalid productId: ${prodId}`);
      }
      const sellerId = prod.seller;
      return {
        productId: new mongoose.Types.ObjectId(prodId),
        quantity: item.quantity,
        price: Number(prod.price) || 0,
        seller:
          sellerId && mongoose.Types.ObjectId.isValid(sellerId)
            ? new mongoose.Types.ObjectId(sellerId)
            : undefined,
      };
    });

    // 3️⃣ Save
    const newOrder = new Order({
      userId: new mongoose.Types.ObjectId(userId),
      items: itemsWithSeller,
      totalAmount,
      shippingAddress,
      paymentType,
      paymentStatus,
      ...(paymentType === "razorpay" && {
        paymentInfo: {
          razorpayOrderId: paymentInfo?.razorpayOrderId || null,
          razorpayPaymentId: paymentInfo?.razorpayPaymentId || null,
        },
      }),
      status: "New",
    });

    return newOrder.save();
  },

  async getOrdersByUser(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const err = new Error("Invalid userId format");
      err.status = 400;
      throw err;
    }
    return Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("items.productId");
  },

  async getOrdersBySeller(sellerId) {
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      const err = new Error("Invalid sellerId format");
      err.status = 400;
      throw err;
    }
    return Order.find({ "items.seller": sellerId })
      .sort({ createdAt: -1 })
      .populate("items.productId")
      .lean();
  },

  async updateOrderById(orderId, updateData) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      const err = new Error("Invalid orderId format");
      err.status = 400;
      throw err;
    }

    const order = await Order.findById(orderId);
    if (!order) {
      const err = new Error("Order not found");
      err.status = 404;
      throw err;
    }

    if (
      updateData.status &&
      updateData.status !== order.status &&
      !isValidStatusTransition(order.status, updateData.status)
    ) {
      const err = new Error(`Invalid status transition from "${order.status}" to "${updateData.status}"`);
      err.status = 400;
      throw err;
    }

    Object.assign(order, updateData);
    return await order.save();
  },
};


