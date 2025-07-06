const User   = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

async function registerUser({ username, email, password, role = "USER" }) {
  if (await User.findOne({ email })) {
    const err = new Error('Email already in use');
    err.status = 400;
    throw err;
  }
  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ username, email, password: hashed, role });
  return user;
}

async function registerSeller({ username, email, password, role="SELLER" }) {
  if (await User.findOne({ email })) {
    const err = new Error('Email already in use');
    err.status = 400;
    throw err;
  }
  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ username, email, password: hashed, role });
  return user;
}

async function authenticateUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const payload = { sub: user._id, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  return { user, token };
}

async function authenticateSeller({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const payload = { sub: user._id, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  return { user, token };
}

module.exports = { registerUser, authenticateUser, registerSeller, authenticateSeller };
