const express = require("express");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Example: Protected Route (Dashboard)
router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}!`, user: req.user });
});

module.exports = router;
