const mongoose = require('mongoose');
const Cart = require('../models/cart.model');

function createHttpError(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function saveAndPopulate(cart) {
  await cart.save();
  return await cart.populate("items.productId");
}

module.exports = {
  async getCartByUserId(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw createHttpError('Invalid userId format');
    }
    return await Cart.findOne({ userId }).populate("items.productId");
  },

  async addItemToCart(userId, productId, quantity) {
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId) ||
      typeof quantity !== 'number' ||
      quantity < 1
    ) {
      throw createHttpError('Invalid cart parameters');
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const idx = cart.items.findIndex(i => i.productId.equals(productId));
    if (idx > -1) {
      cart.items[idx].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    return await saveAndPopulate(cart);
  },

  async updateItemQuantity(userId, productId, quantity) {
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId) ||
      typeof quantity !== 'number' ||
      quantity < 1
    ) {
      throw createHttpError('Invalid update parameters');
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) throw createHttpError('Cart not found', 404);

    const item = cart.items.find(i => i.productId.equals(productId));
    if (!item) throw createHttpError('Product not in cart', 404);

    item.quantity = quantity;
    return await saveAndPopulate(cart);
  },

  async removeItemFromCart(userId, productId) {
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      throw createHttpError('Invalid remove parameters');
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) throw createHttpError('Cart not found', 404);

    cart.items = cart.items.filter(i => !i.productId.equals(productId));
    return await saveAndPopulate(cart);
  },

  async clearCart(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw createHttpError('Invalid userId format');
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) throw createHttpError('Cart not found', 404);

    cart.items = [];
    return await saveAndPopulate(cart);
  }
};
