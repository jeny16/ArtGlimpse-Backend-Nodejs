const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/", protect, (req, res) => {
  res.status(200).json({ valid: true });
});

module.exports = router;
