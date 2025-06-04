// models/order.model.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // assuming you keep userId as a string or ObjectId for users
      ref: "User", 
      required: true
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",    // <— make sure this matches your Product model’s name
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          default: 1
        },
        price: {
          type: Number // you can store a price snapshot here if you want
        }
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    shippingAddress: {
      name:     { type: String, required: true },
      street:   { type: String, required: true },
      city:     { type: String, required: true },
      state:    { type: String, required: true },
      zip:      { type: String, required: true },
      country:  { type: String, required: true },
      mobile:   { type: String, required: true },
      isDefault:{ type: Boolean, default: false }
    },
    paymentInfo: {
      razorpayPaymentId: { type: String, default: null }
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Completed", "Cancelled"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
