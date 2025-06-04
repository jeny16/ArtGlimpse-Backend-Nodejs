const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    deleteUser
} = require('../controllers/user.controller');

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.delete('/profile', deleteUser);

module.exports = router;
