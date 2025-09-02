const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },
});

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [cartItemSchema],
    donationAmount: { type: Number, default: 0 },
    couponCode: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
