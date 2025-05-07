const jwt  = require('jsonwebtoken');
const User = require('../models/user.model');

exports.protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer'))
    return res.status(401).json({ msg: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.sub).select('-password');
    if (!req.user) return res.status(401).json({ msg: 'User not found' });
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: 'Token invalid or expired' });
  }
};
