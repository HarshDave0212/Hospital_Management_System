document.addEventListener("DOMContentLoaded", fetchAppointments);

async function fetchAppointments() {
  let response = await fetch("http://localhost:5001/api/doctor/appointments");
  let appointments = await response.json();
  let tableBody = document.getElementById("appointment-list");
  tableBody.innerHTML = "";

  appointments.forEach((appt) => {
    let row = document.createElement("tr");
    row.innerHTML = `
            <td>${appt.patient_name}</td>
            <td>${appt.date}</td>
            <td>${appt.time}</td>
            <td><button onclick="confirmAppointment(${appt.id})">Confirm</button></td>
        `;
    tableBody.appendChild(row);
  });
}

async function confirmAppointment(id) {
  await fetch(`http://localhost:5001/api/doctor/confirm/${id}`, {
    method: "PUT",
  });
  fetchAppointments();
}

async function setAvailability() {
  let date = document.getElementById("avail-date").value;
  let time = document.getElementById("avail-time").value;
  await fetch("http://localhost:5001/api/doctor/availability", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, time }),
  });
  alert("Availability Set!");
}

async function sendMessage() {
  let message = document.getElementById("message").value;
  document.getElementById("chat-box").innerHTML += `<p>${message}</p>`;
  document.getElementById("message").value = "";
}
