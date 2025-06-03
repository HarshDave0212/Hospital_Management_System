if (!localStorage.getItem("user")) {
  alert("Please log in first.");
  window.location.href = "login.html";
}
document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.user_id : null;

  if (!userId) {
    alert("❌ User ID not found. Please log in again.");
    localStorage.clear();
    window.location.href = "login.html";
    return;
  }

  const profileImage = document.getElementById("profile-image");
  const imageUpload = document.getElementById("imageUpload");
  const logoutBtn = document.getElementById("logout-btn");
  const userDetailsDiv = document.getElementById("user-details");
  const appointmentTableBody = document.getElementById(
    "appointment-table-body"
  );

  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });

  imageUpload.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profileImage.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  try {
    const res = await fetch(`http://localhost:5001/api/user/${userId}`);
    if (!res.ok) throw new Error("User not found");

    const data = await res.json();

    document.getElementById("profile-name").textContent = data.name;
    document.getElementById("profile-email").textContent = data.email;
    document.getElementById("profile-age").textContent = data.age;
    document.getElementById("profile-phone").textContent = data.phone;
    document.getElementById("profile-gender").textContent = data.gender;

    userDetailsDiv.innerHTML = `
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Age:</strong> ${data.age}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Gender:</strong> ${data.gender}</p>
    `;
  } catch (err) {
    console.error("❌ Failed to load user details:", err);
    userDetailsDiv.innerHTML = `<p style="color:red;">Failed to load user data.</p>`;
  }

  try {
    const res = await fetch(
      `http://localhost:5001/api/appointments/patient/${userId}`
    );
    const appointments = await res.json();

    if (appointments.length === 0) {
      appointmentTableBody.innerHTML = `<tr><td colspan="4">No appointments found.</td></tr>`;
    } else {
      appointments.forEach((appt) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${appt.appointment_type}</td>
          <td>${appt.doctor_name || "Doctor"}</td>
          <td>${new Date(appt.appointment_date).toLocaleDateString()}</td>
          <td>${appt.mode || "N/A"}</td>
        `;
        appointmentTableBody.appendChild(row);
      });
    }
  } catch (err) {
    console.error("❌ Failed to load appointment history:", err);
    appointmentTableBody.innerHTML = `<tr><td colspan="4" style="color:red;">Error loading appointments.</td></tr>`;
  }
});
