const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema = new Schema({
  name:         { type: String, required: true },
  street:       { type: String, required: true },
  city:         { type: String, required: true },
  state:        { type: String, required: true },
  zip:          { type: String, required: true },
  country:      { type: String, required: true },
  mobile:       { type: String, required: true },
  isDefault:    { type: Boolean, default: false },
  addressType:  { type: String, enum: ['HOME', 'WORK', 'OTHER'], default: 'HOME' }
}, { _id: false });

const paymentMethodSchema = new Schema({
  type:         { type: String, required: true }, 
  provider:     { type: String },                 
  accountNumber:{ type: String },                 
  expiry:       { type: String }                  
}, { _id: false });


const userSchema = new Schema({
  username:          { type: String, required: true },
  email:             { type: String, required: true, unique: true },
  password:          { type: String, required: true },
  role:              { type: String, enum: ['USER', 'SELLER', 'ADMIN'], default: 'USER' },
  mobile:            { type: String },       
  gender:            { type: String },       
  dateOfBirth:       { type: String },      
  hintName:          { type: String },      
  alternateMobile:   { type: String },      
  addresses:         { type: [addressSchema],    default: [] },
  paymentMethods:    { type: [paymentMethodSchema], default: [] }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('User', userSchema);
