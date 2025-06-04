const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.post("/book", (req, res) => {
  const { user_id, doctor_id, appointment_type, date, age, gender } = req.body;

  if (!user_id || !doctor_id || !appointment_type || !date) {
    return res.status(400).json({ message: "Required fields missing." });
  }

  // Verify doctor exists
  const checkDoctorQuery = "SELECT doctor_id FROM doctors WHERE doctor_id = ?";
  pool.query(checkDoctorQuery, [doctor_id], (err, doctorResults) => {
    if (err) {
      console.error("Error checking doctor:", err);
      return res.status(500).json({ message: "Server error checking doctor." });
    }

    if (doctorResults.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid doctor_id. Doctor does not exist." });
    }

    // Proceed with patient lookup/insert and appointment booking as before
    const findPatientQuery = "SELECT patient_id FROM patient WHERE user_id = ?";
    pool.query(findPatientQuery, [user_id], (err, patientResults) => {
      if (err) {
        console.error("Error finding patient:", err);
        return res
          .status(500)
          .json({ message: "Server error finding patient." });
      }

      if (patientResults.length === 0) {
        if (!age || !gender) {
          return res
            .status(400)
            .json({ message: "Patient data missing for new patient." });
        }

        const insertPatientQuery =
          "INSERT INTO patient (user_id, age, gender) VALUES (?, ?, ?)";
        pool.query(
          insertPatientQuery,
          [user_id, age, gender],
          (err2, insertResult) => {
            if (err2) {
              console.error("Error inserting patient:", err2);
              return res
                .status(500)
                .json({ message: "Error inserting patient." });
            }
            const newPatientId = insertResult.insertId;
            bookAppointment(newPatientId);
          }
        );
      } else {
        const existingPatientId = patientResults[0].patient_id;
        bookAppointment(existingPatientId);
      }
    });

    function bookAppointment(patientId) {
      const insertAppointmentQuery = `
        INSERT INTO appointment (patient_id, doctor_id, appointment_type, status, appointment_date)
        VALUES (?, ?, ?, 'pending', ?)
      `;
      pool.query(
        insertAppointmentQuery,
        [patientId, doctor_id, appointment_type, date],
        (err3, result) => {
          if (err3) {
            console.error("Error booking appointment:", err3);
            return res
              .status(500)
              .json({ message: "Error booking appointment." });
          }
          res.status(201).json({
            message: "Appointment booked successfully.",
            appointmentId: result.insertId,
          });
        }
      );
    }
  });
});
// Export router as usual
module.exports = router;
