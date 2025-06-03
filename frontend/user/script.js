if (!localStorage.getItem("user")) {
  alert("Please log in first.");
  window.location.href = "login.html";
}
document.addEventListener("DOMContentLoaded", function () {
  const chatbotContainer = document.getElementById("chatbotContainer");
  const toggleChatbot = document.getElementById("toggleChatbot");
  const closeChatbot = document.getElementById("closeChatbot");
  const sendMessageBtn = document.getElementById("sendMessage");
  const userMessageInput = document.getElementById("userMessage");
  const chatMessages = document.getElementById("chatMessages");

  // Show chatbot
  toggleChatbot.addEventListener("click", () => {
    chatbotContainer.classList.toggle("hidden");
  });

  // Close chatbot
  closeChatbot.addEventListener("click", () => {
    chatbotContainer.classList.add("hidden");
  });

  // Send Message
  sendMessageBtn.addEventListener("click", () => {
    sendMessage();
  });

  userMessageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });

  async function sendMessage() {
    const message = userMessageInput.value.trim();
    if (message === "") return;

    // Display user message
    const userMessageDiv = document.createElement("div");
    userMessageDiv.classList.add("user-message");
    userMessageDiv.textContent = message;
    chatMessages.appendChild(userMessageDiv);

    userMessageInput.value = "";

    // Show loading indicator
    const botMessageDiv = document.createElement("div");
    botMessageDiv.classList.add("bot-message");
    botMessageDiv.innerHTML = "<i>Thinking...</i>";
    chatMessages.appendChild(botMessageDiv);

    try {
      const response = await fetch("http://localhost:5001/index", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message }),
      });

      const data = await response.json();

      // Format response properly
      botMessageDiv.innerHTML = formatResponse(
        data.response || "Sorry, I couldn't understand that."
      );
    } catch (error) {
      console.error("Error:", error);
      botMessageDiv.innerHTML =
        "<b>Error:</b> AI service unavailable. Please try again.<br>" +
        "<code>" +
        error.message +
        "</code>";
    }
  }

  function formatResponse(text) {
    return text
      .replace(/&/g, "&amp;") // Escape &
      .replace(/</g, "&lt;") // Escape <
      .replace(/>/g, "&gt;") // Escape >
      .replace(/"/g, "&quot;") // Escape "
      .replace(/'/g, "&#039;") // Escape '
      .replace(/\n/g, "<br>") // Convert newlines to <br>
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Convert **bold** to <b>bold</b>
      .replace(/\*(.*?)\*/g, "<i>$1</i>") // Convert *italic* to <i>italic</i>
      .replace(/- (.*?)<br>/g, "<li>$1</li>") // Convert bullet points
      .replace(/<li>(.*?)<\/li>/g, "<ul><li>$1</li></ul>"); // Wrap list items in <ul>
  }
});
