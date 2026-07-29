// =========================
// Ask Rifqi AI
// =========================

const aiBtn = document.getElementById("ai-btn");
const aiChatbox = document.getElementById("ai-chatbox");
const closeAi = document.getElementById("close-ai");
const sendBtn = document.getElementById("send-btn");
const aiInput = document.getElementById("ai-input");
const aiMessages = document.getElementById("ai-messages");
const suggestBtns = document.querySelectorAll(".suggest-btn");

let isSending = false;

// =========================
// Toggle Chatbox
// =========================
if (aiBtn && aiChatbox) {
  aiBtn.addEventListener("click", () => {
    aiChatbox.classList.remove("d-none");
  });
}

if (closeAi && aiChatbox) {
  closeAi.addEventListener("click", () => {
    aiChatbox.classList.add("d-none");
  });
}

// =========================
// Suggested Questions
// =========================
suggestBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!aiInput) return;

    aiInput.value = btn.innerText;
    sendMessage();
  });
});

// =========================
// Send Message Events
// =========================
if (sendBtn) {
  sendBtn.addEventListener("click", sendMessage);
}

if (aiInput) {
  aiInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });
}

// =========================
// Send Message Function
// =========================
async function sendMessage() {
  if (!aiInput || !sendBtn || !aiMessages) return;

  const text = aiInput.value.trim();

  if (!text || isSending) return;

  isSending = true;
  sendBtn.disabled = true;
  aiInput.disabled = true;

  addMessage(text, "user");
  aiInput.value = "";
  showTyping();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: text
      })
    });

    const rawResponse = await response.text();

    let data;

    try {
      data = JSON.parse(rawResponse);
    } catch {
      throw new Error(
        rawResponse ||
        `Server mengembalikan status ${response.status}`
      );
    }

    removeTyping();

    if (!response.ok || !data.success) {
      console.error("API Error Response:", data);

      addMessage(
        data.details ||
        data.error ||
        `Server error ${response.status}`,
        "bot"
      );

      return;
    }

    addMessage(
      data.result || "Maaf, jawaban tidak tersedia.",
      "bot"
    );

  } catch (error) {
    console.error("Fetch error:", error);

    removeTyping();

    addMessage(
      `Maaf, gagal terhubung ke server AI. ${error.message}`,
      "bot"
    );

  } finally {
    isSending = false;
    sendBtn.disabled = false;
    aiInput.disabled = false;
    aiInput.focus();
  }
}

// =========================
// UI Helpers
// =========================
function addMessage(text, type) {
  const div = document.createElement("div");

  div.classList.add("ai-message", type);

  // Lebih aman daripada innerHTML langsung
  div.textContent = text;

  aiMessages.appendChild(div);
  aiMessages.scrollTop = aiMessages.scrollHeight;
}

function showTyping() {
  removeTyping();

  const typing = document.createElement("div");

  typing.classList.add(
    "ai-message",
    "bot",
    "typing-message"
  );

  typing.innerHTML =
    "Rifqi AI sedang berpikir<span class='typing'></span>";

  aiMessages.appendChild(typing);
  aiMessages.scrollTop = aiMessages.scrollHeight;
}

function removeTyping() {
  const typing = document.querySelector(".typing-message");

  if (typing) {
    typing.remove();
  }
} 