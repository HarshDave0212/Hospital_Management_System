document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("toggleChatbot");
  const chatbotContainer = document.getElementById("chatbotContainer");
  const closeChatbot = document.getElementById("closeChatbot");
  const sendMessageBtn = document.getElementById("sendMessage");
  const userMessageInput = document.getElementById("userMessage");
  const chatMessages = document.getElementById("chatMessages");

  // Toggle Chatbot Visibility
  toggleButton.addEventListener("click", () => {
    chatbotContainer.classList.toggle("hidden");
  });

  closeChatbot.addEventListener("click", () => {
    chatbotContainer.classList.add("hidden");
  });

  // Send Message to AI
  sendMessageBtn.addEventListener("click", async () => {
    const userMessage = userMessageInput.value.trim();
    if (!userMessage) return;

    // Display User Message
    chatMessages.innerHTML += `<div><strong>You:</strong> ${userMessage}</div>`;
    userMessageInput.value = "";

    // Send Request to AI API
    try {
      const response = await fetch("http://localhost:5001/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      chatMessages.innerHTML += `<div><strong>AI:</strong> ${data.response}</div>`;
    } catch (error) {
      chatMessages.innerHTML += `<div style="color: red;"><strong>Error:</strong> Unable to connect.</div>`;
    }

    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to latest message
  });
});
