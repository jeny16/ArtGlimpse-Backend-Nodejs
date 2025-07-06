// src/services/order.service.js
const mongoose = require('mongoose');
const Order = require('../models/order.model');

module.exports = {
  /**
   * Create a new order.
   * @param {Object} orderData
   * @throws {Error} with .status for HTTP code
   * @returns {Promise<Order>}
   */
  async createOrder(orderData) {
    const { userId, items, totalAmount, shippingAddress, paymentInfo } = orderData;

    // Validate required fields
    if (
      !userId ||
      !mongoose.Types.ObjectId.isValid(userId) ||
      !Array.isArray(items) ||
      items.length === 0 ||
      typeof totalAmount !== 'number' ||
      !shippingAddress
    ) {
      const err = new Error('Missing or invalid required fields');
      err.status = 400;
      throw err;
    }

    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      shippingAddress,
      paymentInfo: {
        razorpayPaymentId: paymentInfo?.razorpayPaymentId ?? null
      },
      status: 'Pending'
    });

    return await newOrder.save();
  },

  /**
   * Fetch orders for a user.
   * @param {string} userId
   * @throws {Error}
   * @returns {Promise<Order[]>}
   */
  async getOrdersByUser(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const err = new Error('Invalid userId format');
      err.status = 400;
      throw err;
    }
    return await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate({ path: 'items.productId' });
  },

  /**
   * Fetch orders containing at least one product sold by seller.
   * @param {string} sellerId
   * @throws {Error}
   * @returns {Promise<Order[]>}
   */
  async getOrdersBySeller(sellerId) {
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      const err = new Error('Invalid sellerId format');
      err.status = 400;
      throw err;
    }
    return await Order.find({ 'items.productId.seller': sellerId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'items.productId',
        select: 'name price seller images'
      });
  }
};
