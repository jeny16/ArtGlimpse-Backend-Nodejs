const authService = require('../service/auth.service');

exports.signup = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({
      msg: 'User registered',
      userId: user._id,
    });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { user, token } = await authService.authenticateUser(req.body);
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ msg: err.message });
  }
};

// exports.getMe = (req, res) => {
//   // this assumes auth.middleware has set req.user
//   res.json({ user: req.user });
// };

exports.validate = (req, res) => {
  // If we reach here, `protect` passed, so token is valid
  res.status(200).json({ valid: true });
};