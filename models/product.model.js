const mongoose = require('mongoose');
// ensure Category is registered before Product tries to reference it
require('./category.model');

const ProductSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',    // must exactly match the model name
    required: true
  },
  price:       { type: Number, required: true },
  currency:    { type: String, default: 'INR' },
  stock:       { type: Number, default: 0 },
  images:      [{ type: String }],

  discount:             { type: Boolean, default: false },
  valid_Until_Discount: { type: Date },
  percentage_Discount:  { type: Number },

  processing_Time:   { type: String },
  shipping_Time:     { type: String },
  shipping_Cost:     { type: Number },
  estimated_Delivery:{ type: String },
  countries_Available:[{ type: String }],
  materials_Made:    [{ type: String }],
  tags:              [{ type: String }],

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',    // you can remove this later if not using Seller
    required: true
  }
}, {
  timestamps: true,
  collection: 'products',
});

module.exports = mongoose.model('Product', ProductSchema);
