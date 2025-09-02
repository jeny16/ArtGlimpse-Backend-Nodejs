const express = require('express');
const { signup, login,sellerSignup, sellerLogin, getMe } = require('../controllers/auth.controllers');
const { protect }              = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login',  login);
router.post('/seller/signup', sellerSignup);
router.post('/seller/login', sellerLogin);

module.exports = router;
