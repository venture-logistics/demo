function toggleChat() {
  const chat = document.getElementById("chat-body");
  chat.style.display = chat.style.display === "block" ? "none" : "block";
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    askQuestion();
  }
}

async function askQuestion() {
  const input = document.getElementById("chat-input");
  const question = input.value.trim();
  if (!question) return;

  const log = document.getElementById("chat-log");
  log.innerHTML += `<p><strong>You:</strong> ${question}</p>`;
  input.value = "";

  const typing = document.createElement("p");
  typing.className = "typing-indicator";
  typing.textContent = "Bot is thinking...";
  log.appendChild(typing);
  log.scrollTop = log.scrollHeight;

  try {
    const response = await fetch("https://chat-bot-iury.onrender.com/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

      if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    typing.remove();
    log.innerHTML += `<p><strong>Bot:</strong> ${data.answer}</p>`;
    log.scrollTop = log.scrollHeight;
  } catch (error) {
    typing.remove();
    log.innerHTML += `<p><strong>Bot:</strong> Error. Try again later.</p>`;
    console.error("Chatbot error:", error);
  }
}

// Optionally, hide the chat body by default
window.onload = function() {
  document.getElementById("chat-body").style.display = "none";
};
