// controllers/cart.controller.js
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

exports.getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addItemToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity, price } = req.body;

    if (!productId || !quantity || !price) {
      return res.status(400).json({ success: false, message: "Missing productId, quantity, or price." });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, price });
    }

    await cart.save();
    const populatedCart = await cart.populate("items.productId");

    res.status(200).json(populatedCart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// PUT /:userId/:productId
exports.updateItemQuantity = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((item) => item.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: "Product not in cart." });

    item.quantity = quantity;
    await cart.save();
    const populatedCart = await cart.populate("items.productId");

    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /:userId/:productId
exports.removeItemFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    const populatedCart = await cart.populate("items.productId");

    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
