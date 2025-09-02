const User = require('../models/user.model');


exports.getProfile = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: 'userId query parameter is required.' });
  }

  try {
    const user = await User.findById(userId).select('-password').lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    return res.status(500).json({ message: 'Failed to fetch profile.' });
  }
};

exports.updateProfile = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: 'userId query parameter is required.' });
  }

  // We accept any of the user fields in the request body. For security, 
  // do NOT allow updating password or role here (unless you explicitly want to).
  const allowedUpdate = {
    mobile:          req.body.mobile,
    gender:          req.body.gender,
    dateOfBirth:     req.body.dateOfBirth,
    hintName:        req.body.hintName,
    alternateMobile: req.body.alternateMobile,
    addresses:       Array.isArray(req.body.addresses) ? req.body.addresses : undefined,
    paymentMethods:  Array.isArray(req.body.paymentMethods) ? req.body.paymentMethods : undefined
  };

  // Remove undefined keys
  Object.keys(allowedUpdate).forEach(key => {
    if (allowedUpdate[key] === undefined) {
      delete allowedUpdate[key];
    }
  });

  if (Object.keys(allowedUpdate).length === 0) {
    return res.status(400).json({ message: 'No valid fields provided to update.' });
  }

  try {
    const options = { new: true }; // return the updated document
    const updatedUser = await User.findByIdAndUpdate(userId, allowedUpdate, options).select('-password').lean();
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json(updatedUser);
  } catch (err) {
    console.error('Error updating profile:', err);
    return res.status(500).json({ message: 'Failed to update profile.' });
  }
};

/**
 * DELETE /api/user/profile?userId=...
 * Deletes a User (and implicitly its buyer profile) by ID.
 */
exports.deleteUser = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: 'userId query parameter is required.' });
  }

  try {
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Error deleting user:', err);
    return res.status(500).json({ message: 'Failed to delete user.' });
  }
};
