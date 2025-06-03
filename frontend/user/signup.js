document
  .getElementById("signup-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const age = parseInt(document.getElementById("age").value);
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const gender = document.getElementById("gender").value;
    const medical_history = document.getElementById("medical_history").value;

    const errorField = document.getElementById("password-error");
    errorField.textContent = "";

    if (password !== confirmPassword) {
      errorField.textContent = "Passwords do not match!";
      return;
    }

    const data = {
      name,
      age,
      phone,
      email,
      password,
      gender,
      medical_history,
    };

    try {
      const response = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Sign up successful!");
        window.location.href = "login.html";
      } else {
        alert("Sign up failed: " + result.message);
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
      console.error(err);
    }
  });
