const apiUrl = "http://localhost:5001/api/admin";

// ✅ Fetch and display all users
function fetchUsers() {
  fetch(`${apiUrl}/users`)
    .then((res) => res.json())
    .then((users) => {
      const userTable = document.getElementById("user-table");
      userTable.innerHTML = "";

      users.forEach((user) => {
        userTable.innerHTML += `
          <tr>
            <td>${user.user_id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.role}</td>
            <td>${user.age}</td>
            <td>${user.gender}</td>
            <td>${user.specialiation || "-"}</td>
            <td>
              <input type="text" id="roleInput_${
                user.user_id
              }" placeholder="New Role" />
              <button onclick="updateRole(${user.user_id})">Update</button>
              <button onclick="deleteUser(${user.user_id})">Delete</button>
            </td>
          </tr>
        `;
      });
    })
    .catch((err) => console.error("Error fetching users:", err));
}

// ✅ Add a new user (doctor/admin)
document.getElementById("add-user-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const phone = document.getElementById("phone").value;
  const age = document.getElementById("age").value;
  const gender = document.getElementById("gender").value;
  const role = document.getElementById("role").value;
  const specialiation = document.getElementById("specialization").value;

  if (!name || !email || !password || !phone || !age || !gender || !role) {
    alert("Please fill in all required fields.");
    return;
  }

  fetch(`${apiUrl}/add-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      password,
      phone,
      age,
      gender,
      role,
      specialiation: role === "doctor" ? specialiation : null,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      document.getElementById("add-user-form").reset();
      fetchUsers();
    })
    .catch((err) => console.error("Error adding user:", err));
});

// ✅ Update a user's role
function updateRole(userId) {
  const newRole = document.getElementById(`roleInput_${userId}`).value;
  if (!newRole) {
    alert("Please enter a new role.");
    return;
  }

  fetch(`${apiUrl}/update-role/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: newRole }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      fetchUsers();
    })
    .catch((err) => console.error("Error updating role:", err));
}

// ✅ Delete a user
function deleteUser(userId) {
  if (confirm("Are you sure you want to delete this user?")) {
    fetch(`${apiUrl}/delete-user/${userId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        fetchUsers();
      })
      .catch((err) => console.error("Error deleting user:", err));
  }
}

// ✅ Initial load
fetchUsers();
