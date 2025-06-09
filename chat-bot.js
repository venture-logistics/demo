let chatStep = 0;      // 0 = greeting, 1 = ask for name, 2 = ask for email, 3 = chat
let userName = null;   // Holds the user's name
let userEmail = null;  // Holds the user's email

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
  const userInput = input.value.trim();
  if (!userInput) return;
  input.value = "";

  if (chatStep === 0) {
    log.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;
    log.innerHTML += `<p><strong>Bot:</strong> Hi there! What's your name?</p>`;
    log.scrollTop = log.scrollHeight;
    chatStep = 1;
    return;
  }

  if (chatStep === 1) {
    userName = userInput;
    log.innerHTML += `<p><strong>You:</strong> ${userName}</p>`;
    log.innerHTML += `<p><strong>Bot:</strong> Nice to meet you, ${userName}! What's your email?</p>`;
    log.scrollTop = log.scrollHeight;
    chatStep = 2;
    return;
  }

  if (chatStep === 2) {
    userEmail = userInput;
    log.innerHTML += `<p><strong>You:</strong> ${userEmail}</p>`;
    log.innerHTML += `<p><strong>Bot:</strong> Great! Ask me anything.</p>`;
    log.scrollTop = log.scrollHeight;
    chatStep = 3;
    return;
  }

  // Normal chat
  log.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;
  const typing = document.createElement("p");
  typing.textContent = "Bot is thinking...";
  log.appendChild(typing);
  log.scrollTop = log.scrollHeight;

  const payload = {
    name: userName,
    email: userEmail,
    question: userInput
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
