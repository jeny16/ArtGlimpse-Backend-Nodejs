const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

exports.getCartByUserId = async (userId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) return null;

  const productIds = cart.items.map(item => item.productId);
  const products = await Product.find({ _id: { $in: productIds } }).populate('category');

  const productMap = {};
  products.forEach(p => productMap[p._id.toString()] = p);

  const enrichedItems = cart.items.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
    productData: productMap[item.productId.toString()] || null
  }));

  return {
    userId: cart.userId,
    items: enrichedItems
  };
};

exports.createCart = async (userId) => {
  const newCart = new Cart({ userId, items: [] });
  return await newCart.save();
};

exports.addItemToCart = async (userId, productId, quantity) => {
  // 1) Find the product so you know its price
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // 2) Find (or create) this user's cart
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  // 3) Calculate the price you want to store on the cart item
  //    (either product.price or a discounted price if you have discounts)
  let itemPrice = product.price;
  if (product.discount && product.percentage_Discount) {
    // If you want to store discounted price:
    itemPrice = product.price - (product.price * product.percentage_Discount) / 100;
  }

  // 4) Check if this item is already in the cart
  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex > -1) {
    // If it’s already there, update quantity and (optionally) price
    cart.items[itemIndex].quantity += quantity;
    cart.items[itemIndex].price = itemPrice;
  } else {
    // If it’s brand-new, push an object that includes price
    cart.items.push({
      productId: productId,
      quantity: quantity,
      price: itemPrice,  // ← Now price is included, matching your schema
    });
  }

  // 5) Save and return the updated cart
  await cart.save();
  return await exports.getCartByUserId(userId);
};

exports.removeItemFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) return null;

  cart.items = cart.items.filter(item => item.productId.toString() !== productId);
  await cart.save();
  return await exports.getCartByUserId(userId);
};

exports.clearCart = async (userId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) return null;

  cart.items = [];
  await cart.save();
  return await exports.getCartByUserId(userId);
};
