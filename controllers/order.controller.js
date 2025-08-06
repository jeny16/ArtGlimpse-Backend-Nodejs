const orderModel = require("../models/order.model");
const orderService = require("../service/order.service");

exports.createNewOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("Error in createNewOrder:", err);
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message });
  }
};

exports.getOrdersByUserId = async (req, res) => {
  try {
    const orders = await orderService.getOrdersByUser(req.params.userId);
    res.json({ success: true, orders });
  } catch (err) {
    console.error("Error in getOrdersByUserId:", err);
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message });
  }
};

exports.getOrdersBySeller = async (req, res) => {
  try {
    const orders = await orderService.getOrdersBySeller(req.params.sellerId);
    res.json({ success: true, orders });
  } catch (err) {
    console.error("Error in getOrdersBySeller:", err);
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message });
  }
};

exports.updateOrderById = async (req, res) => {
  try {
    const updated = await orderService.updateOrderById(
      req.params.orderId,
      req.body
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true, order: updated });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("Error fetching order by ID:", err);
    res.status(500).json({ success: false, message: 'Failed to fetch order', error: err.message });
  }
};
