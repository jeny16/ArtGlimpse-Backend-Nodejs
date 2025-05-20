const Wishlist = require('../models/wishlist.model');

exports.addToWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    await new Wishlist({ userId, productId }).save();
    const wish = await Wishlist.find({ userId }).populate('productId');
    return res.status(201).json({ data: wish, count: wish.length });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Item already in wishlist" });
    }
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    await Wishlist.findOneAndDelete({ userId, productId });
    const wish = await Wishlist.find({ userId }).populate('productId');
    return res.status(200).json({ data: wish, count: wish.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const wish = await Wishlist.find({ userId })
      .populate('productId')
      .exec();
    return res.status(200).json({ data: wish, count: wish.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
