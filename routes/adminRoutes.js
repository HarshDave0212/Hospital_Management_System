const express = require("express");
const db = require("../config/db");
const router = express.Router();
const bcrypt = require("bcryptjs");

// ✅ Get All Users (Admin Panel)
router.get("/users", (req, res) => {
  db.query("SELECT * FROM user", (err, result) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Failed to fetch users" });
    }
    res.json(result);
  });
});

// ✅ Add a New Doctor or Admin (fixed callback style)
router.post("/add-user", (req, res) => {
  const { name, email, phone, age, gender, role, password } = req.body;

  if (!name || !email || !phone || !age || !gender || !role || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (!["doctor", "admin"].includes(role)) {
    return res
      .status(400)
      .json({ error: "Invalid role. Allowed: doctor, admin." });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO user (name, email, phone, age, gender, role, password) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [name, email, phone, age, gender, role, hashedPassword],
    (err, result) => {
      if (err) {
        console.error("❌ Add User Error:", err);
        return res.status(500).json({ error: "Failed to add user" });
      }
      res.json({ message: "User added successfully!" });
    }
  );
});

// ✅ Update User Role
router.put("/update-role/:id", (req, res) => {
  const { role } = req.body;
  const userId = req.params.id;

  if (!["doctor", "admin", "patient"].includes(role)) {
    return res.status(400).json({ error: "Invalid role." });
  }

  db.query(
    "UPDATE user SET role = ? WHERE user_id = ?",
    [role, userId],
    (err, result) => {
      if (err) {
        console.error("❌ Update Role Error:", err);
        return res.status(500).json({ error: "Failed to update role" });
      }
      res.json({ message: "User role updated successfully!" });
    }
  );
});

// ✅ Delete User
router.delete("/delete-user/:id", (req, res) => {
  const userId = req.params.id;

  db.query("DELETE FROM user WHERE user_id = ?", [userId], (err, result) => {
    if (err) {
      console.error("❌ Delete User Error:", err);
      return res.status(500).json({ error: "Failed to delete user" });
    }
    res.json({ message: "User deleted successfully!" });
  });
});

// ✅ Get All Doctors
router.get("/doctors", (req, res) => {
  const query =
    "SELECT doctor_id, name, specialiation, availability_schedule FROM doctors";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching doctors:", err);
      return res.status(500).json({ error: "Failed to fetch doctors" });
    }
    res.json(result);
  });
});

// ✅ Update Doctor Availability
router.put("/update-availability/:id", (req, res) => {
  const doctorId = req.params.id;
  const { availability_schedule } = req.body;

  db.query(
    "UPDATE doctors SET availability_schedule = ? WHERE doctor_id = ?",
    [availability_schedule, doctorId],
    (err, result) => {
      if (err) {
        console.error("❌ Update Availability Error:", err);
        return res.status(500).json({ error: "Failed to update availability" });
      }
      res.json({ message: "Doctor availability updated successfully!" });
    }
  );
});

module.exports = router;
