const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');

router.post('/', wishlistController.addToWishlist);
router.get('/:userId', wishlistController.getWishlist);
router.delete('/', wishlistController.removeFromWishlist);

module.exports = router;
