const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  categories: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  stock: { type: Number, default: 0 },
  images: [{ type: String }],

  discount: { type: Boolean, default: false },
  valid_Until_Discount: { type: Date },
  percentage_Discount: { type: Number },

  processing_Time: { type: String },
  shipping_Time: { type: String },
  shipping_Cost: { type: Number },
  estimated_Delivery: { type: String },
  countries_Available: [{ type: String }],
  materials_Made: [{ type: String }],
  tags: [{ type: String }],

  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true }
}, { 
  timestamps: true,
  collection: 'products',
});

module.exports = mongoose.model('Product', ProductSchema);