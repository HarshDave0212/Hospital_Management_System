document
  .getElementById("login-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user info in localStorage (optional)
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Login successful!");

        // Redirect based on role
        if (data.user.role === "admin") {
          window.location.href = "admin.html";
        } else if (data.user.role === "doctor") {
          window.location.href = "doctor-dashboard.html";
        } else {
          window.location.href = "index.html";
        }
      } else {
        alert(data.message || "Login failed.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Try again.");
    }
  });
