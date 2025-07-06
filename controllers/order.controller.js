// src/controllers/order.controller.js
const orderService = require('../service/order.service');

exports.createNewOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);
    return res.status(201).json({ success: true, order });
  } catch (err) {
    console.error('Error in createNewOrder:', err);
    return res
      .status(err.status || 500)
      .json({ success: false, message: err.message || 'Could not create order.' });
  }
};

exports.getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await orderService.getOrdersByUser(userId);
    return res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error('Error in getOrdersByUserId:', err);
    return res
      .status(err.status || 500)
      .json({ success: false, message: err.message || 'Could not fetch orders.' });
  }
};

exports.getOrdersBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const orders = await orderService.getOrdersBySeller(sellerId);
    return res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error('Error in getOrdersBySeller:', err);
    return res
      .status(err.status || 500)
      .json({ success: false, message: err.message || 'Could not fetch seller orders.' });
  }
};
