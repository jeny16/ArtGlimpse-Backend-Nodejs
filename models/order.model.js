const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number },
        seller: { type: mongoose.Schema.Types.ObjectId, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },

    shippingAddress: {
      name: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true },
      mobile: { type: String, required: true },
      isDefault: { type: Boolean, default: false },
    },

    paymentInfo: {
      razorpayOrderId: { type: String, default: null },
      razorpayPaymentId: { type: String, default: null },
    },

    paymentType: {
      type: String,
      enum: ["cashOnDelivery", "razorpay"],
      required: true,
      default: "razorpay",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded", "Cancelled"],
      required: true,
      default: "Pending",
    },
    paidAt: { type: Date, default: null },
    refundedAt: { type: Date, default: null },

    status: {
      type: String,
      enum: ["New", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "New",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
