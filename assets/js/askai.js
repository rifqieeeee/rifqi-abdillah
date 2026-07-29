// =========================
// Ask Rifqi AI
// =========================

const aiBtn = document.getElementById("ai-btn");
const aiChatbox = document.getElementById("ai-chatbox");
const closeAi = document.getElementById("close-ai");
const minimizeAi = document.getElementById("minimize-ai");
const maximizeAi = document.getElementById("maximize-ai");
const sendBtn = document.getElementById("send-btn");
const aiInput = document.getElementById("ai-input");
const aiMessages = document.getElementById("ai-messages");
const suggestBtns = document.querySelectorAll(".suggest-btn");


let isSending = false;

// =========================
// Chat Window Controls
// =========================

if (aiBtn && aiChatbox) {
  aiBtn.addEventListener("click", () => {
    aiChatbox.classList.remove("d-none");
    aiChatbox.classList.remove("ai-minimized");
  });
}

if (closeAi && aiChatbox) {
  closeAi.addEventListener("click", () => {
    aiChatbox.classList.add("d-none");
    aiChatbox.classList.remove(
      "ai-minimized",
      "ai-maximized"
    );

    updateMaximizeIcon();
  });
}

if (minimizeAi && aiChatbox) {
  minimizeAi.addEventListener("click", () => {
    const isMinimized =
      aiChatbox.classList.contains("ai-minimized");

    aiChatbox.classList.remove("ai-maximized");
    aiChatbox.classList.toggle(
      "ai-minimized",
      !isMinimized
    );

    updateMaximizeIcon();
  });
}

if (maximizeAi && aiChatbox) {
  maximizeAi.addEventListener("click", () => {
    const isMaximized =
      aiChatbox.classList.contains("ai-maximized");

    aiChatbox.classList.remove("ai-minimized");
    aiChatbox.classList.toggle(
      "ai-maximized",
      !isMaximized
    );

    updateMaximizeIcon();
  });
}

function updateMaximizeIcon() {
  if (!maximizeAi || !aiChatbox) return;

  const icon = maximizeAi.querySelector("i");
  const isMaximized =
    aiChatbox.classList.contains("ai-maximized");

  if (!icon) return;

  if (isMaximized) {
    icon.className = "bi bi-fullscreen-exit";
    maximizeAi.title = "Restore";
    maximizeAi.setAttribute(
      "aria-label",
      "Restore chat size"
    );
  } else {
    icon.className = "bi bi-arrows-fullscreen";
    maximizeAi.title = "Maximize";
    maximizeAi.setAttribute(
      "aria-label",
      "Maximize chat"
    );
  }
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

  const contentType =
    response.headers.get("content-type") || "";

  let data = null;

  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    // Jangan tampilkan respons teknis Vercel kepada pengguna
    await response.text().catch(() => "");
  }

  removeTyping();

  if (!response.ok || !data?.success) {
    console.error(
      "API request failed:",
      response.status,
      data
    );

    addMessage(
      data?.error ||
        "Maaf, Rifqi AI sedang mengalami kendala. Silakan coba kembali nanti.",
      "bot"
    );

    return;
  }

  addMessage(data.result, "bot");

  } catch (error) {
    console.error("Fetch error:", error);

    removeTyping();

    addMessage(
      `Sorry, failed to connect to AI server. ${error.message}`,
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
    "Rifqi AI is thinking<span class='typing'></span>";

  aiMessages.appendChild(typing);
  aiMessages.scrollTop = aiMessages.scrollHeight;
}

function removeTyping() {
  const typing = document.querySelector(".typing-message");

  if (typing) {
    typing.remove();
  }
} 