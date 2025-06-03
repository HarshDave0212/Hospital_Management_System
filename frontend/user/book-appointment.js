if (!localStorage.getItem("user")) {
  alert("Please log in first.");
  window.location.href = "login.html";
}

window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const doctorName = urlParams.get("doctor_name");
  const specialiation = urlParams.get("specialiation");
  const doctorId = urlParams.get("doctor_id");

  const doctorSelect = document.getElementById("doctor");
  const specialtySelect = document.getElementById("specialty");
  const dateInput = document.getElementById("date");

  // Autofill patient details from localStorage
  const patientData = JSON.parse(localStorage.getItem("patientData"));
  const userName = localStorage.getItem("user_name");

  if (patientData) {
    document.getElementById("name").value = patientData.name || userName || "";
    document.getElementById("age").value = patientData.age || "";
    document.getElementById("gender").value = patientData.gender || "";
    document.getElementById("contact").value = patientData.phone || "";
  } else if (userName) {
    document.getElementById("name").value = userName;
  }

  // If doctor details present in URL, autofill and disable fields
  if (doctorName && specialiation && doctorId) {
    doctorSelect.disabled = false;
    specialtySelect.disabled = false;

    const doctorOption = document.createElement("option");
    doctorOption.value = doctorId;
    doctorOption.textContent = doctorName;
    doctorOption.selected = true;
    doctorSelect.appendChild(doctorOption);

    const specOption = document.createElement("option");
    specOption.value = specialiation;
    specOption.textContent = specialiation;
    specOption.selected = true;
    specialtySelect.appendChild(specOption);

    // Set today's date
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.value = `${yyyy}-${mm}-${dd}`;
    dateInput.disabled = false;
  }

  const form = document.getElementById("appointment-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const patientName = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const contact = document.getElementById("contact").value;
    const selectedDoctorId = doctorSelect.value;
    const appointmentDate = dateInput.value;
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user ? user.user_id || user.id || user.id : null;

    if (!user_id) {
      alert("⚠️ User not logged in. Please log in first.");
      window.location.href = "login.html";
      return;
    }

    if (
      !patientName ||
      !age ||
      !gender ||
      !contact ||
      !selectedDoctorId ||
      !appointmentDate
    ) {
      alert("⚠️ Please fill in all fields.");
      return;
    }

    const appointmentData = {
      patient_id: user_id,
      doctor_id: selectedDoctorId,
      appointment_type: "offline",
      appointment_date: appointmentDate,
    };

    const submitButton = form.querySelector("button[type='submit']");
    submitButton.disabled = true;
    submitButton.textContent = "Booking...";

    try {
      const res = await fetch("http://localhost:5001/api/appointments/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          age: age,
          gender: gender,
          doctor_id: selectedDoctorId,
          date: appointmentDate,
          appointment_type: "offline",
          user_id: user_id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Appointment booked successfully!");
        form.reset();
        window.location.href = "appointments.html"; // or wherever you list appointments
      } else {
        alert("❌ Booking failed: " + data.message);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("❌ Error booking appointment.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Book Appointment";
    }
  });
});
