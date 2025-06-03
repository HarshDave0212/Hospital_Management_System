if (!localStorage.getItem("user")) {
  alert("Please log in first.");
  window.location.href = "login.html";
}
// Fetch and display doctors, with optional search filters
async function fetchDoctors(doctorName = "", specialization = "") {
  try {
    // Encode query params to handle spaces or special chars
    const response = await fetch(
      `http://localhost:5001/api/user/find-a-doctor?doctorName=${encodeURIComponent(
        doctorName
      )}&specialization=${encodeURIComponent(specialization)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const doctors = await response.json();

    // Get tbody element inside doctorTable
    const doctorTableBody = document.querySelector("#doctorTable tbody");
    doctorTableBody.innerHTML = ""; // Clear previous rows

    if (doctors.length === 0) {
      doctorTableBody.innerHTML = `<tr><td colspan="4">No doctors found.</td></tr>`;
      return;
    }

    doctors.forEach((doctor) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${doctor.doctor_name}</td>
        <td>${doctor.specialiation}</td> <!-- Using the typo column -->
        <td>${doctor.availability_schedule}</td>
<td><button onclick="bookAppointment(${
        doctor.user_id
      }, '${doctor.doctor_name.replace(
        /'/g,
        "\\'"
      )}', '${doctor.specialiation.replace(
        /'/g,
        "\\'"
      )}')">Book Appointment</button></td>
      `;

      doctorTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);

    // Show error in the table for the user
    const doctorTableBody = document.querySelector("#doctorTable tbody");
    doctorTableBody.innerHTML = `<tr><td colspan="4">Failed to load doctors. Please try again later.</td></tr>`;
  }
}

// Search button handler: read inputs and fetch accordingly
function searchDoctors() {
  const doctorName = document.getElementById("searchName").value.trim();
  const specialization = document
    .getElementById("searchSpecialization")
    .value.trim();

  fetchDoctors(doctorName, specialization);
}

// Example placeholder for the book appointment button
function bookAppointment(doctorId, doctorName, specialiation) {
  const url = `book-appointment.html?doctor_name=${encodeURIComponent(
    doctorName
  )}&specialiation=${encodeURIComponent(specialiation)}&doctor_id=${doctorId}`;
  window.location.href = url;
}

// Load all doctors on page load
window.onload = function () {
  fetchDoctors();
};
