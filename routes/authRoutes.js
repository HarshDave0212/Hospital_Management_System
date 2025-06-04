const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../config/db"); // Assuming db.js has a callback-based connection

// Login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  db.query("SELECT * FROM user WHERE email = ?", [email], (err, users) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    // Compare password
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }

      if (!match) {
        return res.status(401).json({ message: "Incorrect password" });
      }

      // Optional: exclude password before sending response
      const { password: _, ...userData } = user;

      // Send response
      res.status(200).json({ message: "Login successful", user: userData });
    });
  });
});

module.exports = router;
