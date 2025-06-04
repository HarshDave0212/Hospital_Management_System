const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const connection = require("../config/db"); // make sure this path is correct

// ✅ Add user (with role-specific insert)
router.post("/admin/add-user", (req, res) => {
  const { name, email, password, phone, age, gender, role, specialization } =
    req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO user (name, email, password, phone, role, age, gender) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [name, email, hashedPassword, phone, role, age, gender],
    (err, result) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      const userId = result.insertId;

      if (role === "doctor") {
        db.query(
          "INSERT INTO doctors (user_id, name, specialiation) VALUES (?, ?, ?)",
          [userId, name, specialization],
          (err2) => {
            if (err2) {
              console.error("Error inserting doctor:", err2);
              return res.status(500).json({ message: "Internal server error" });
            }
            res.status(201).json({ message: "doctor added successfully" });
          }
        );
      } else if (role === "admin") {
        db.query(
          "INSERT INTO admin (user_id, name) VALUES (?, ?)",
          [userId, name],
          (err2) => {
            if (err2) {
              console.error("Error inserting admin:", err2);
              return res.status(500).json({ message: "Internal server error" });
            }
            res.status(201).json({ message: "admin added successfully" });
          }
        );
      } else {
        res.status(201).json({ message: "User added" });
      }
    }
  );
});

// ✅ Get all active doctors with search functionality
router.get("/find-a-doctor", (req, res) => {
  const { doctorName, specialization } = req.query;

  let sql = `
    SELECT name AS doctor_name, specialiation, availability_schedule, user_id 
    FROM doctors 
    WHERE 1=1
  `;

  if (doctorName) {
    sql += ` AND name LIKE '%${doctorName}%'`;
  }

  if (specialization) {
    sql += ` AND specialiation LIKE '%${specialization}%'`;
  }

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results);
  });
});

// GET user by ID
router.get("/:id", (req, res) => {
  const userId = req.params.id;

  const query = "SELECT * FROM user WHERE user_id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(results[0]);
  });
});

module.exports = router;
