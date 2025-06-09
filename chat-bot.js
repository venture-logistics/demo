// Track user info in JS variables
let userName = null;
let userEmail = null;

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
  const log = document.getElementById("chat-log");
  const question = input.value.trim();
  if (!question) return;
  input.value = "";

  // If userName is not set, capture it and prompt for email
  if (!userName) {
    userName = question;
    log.innerHTML += `<p><strong>You:</strong> ${question}</p>`;
    log.innerHTML += `<p><strong>Bot:</strong> Hi ${userName}! What's your email?</p>`;
    log.scrollTop = log.scrollHeight;
    return;
  }

  // If userEmail is not set, capture it and prompt for questions
  if (!userEmail) {
    userEmail = question;
    log.innerHTML += `<p><strong>You:</strong> ${question}</p>`;
    log.innerHTML += `<p><strong>Bot:</strong> Great! Ask me anything.</p>`;
    log.scrollTop = log.scrollHeight;
    return;
  }

  // Normal chat after name and email are set
  log.innerHTML += `<p><strong>You:</strong> ${question}</p>`;
  const typing = document.createElement("p");
  typing.textContent = "Bot is thinking...";
  log.appendChild(typing);
  log.scrollTop = log.scrollHeight;

  const payload = {
    name: userName,
    email: userEmail,
    question: question
  };

  try {
    const res = await fetch("https://chat-bot-iury.onrender.com/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();

    typing.remove();
    log.innerHTML += `<p><strong>Bot:</strong> ${data.answer}</p>`;
    log.scrollTop = log.scrollHeight;
  } catch (error) {
    console.error("Chatbot error:", error);
    typing.remove();
    log.innerHTML += `<p><strong>Bot:</strong> Something went wrong.</p>`;
    log.scrollTop = log.scrollHeight;
  }
}
