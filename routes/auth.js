const express = require('express');
const { signup, login, getMe } = require('../controllers/auth.controllers');
const { protect }              = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login',  login);

// protected “get me” example:
router.get('/me', protect, getMe);

module.exports = router;    
