// =========================
// Ask Rifqi AI (Vercel Serverless + Gemini API)
// =========================

const aiBtn = document.getElementById("ai-btn");
const aiChatbox = document.getElementById("ai-chatbox");
const closeAi = document.getElementById("close-ai");
const sendBtn = document.getElementById("send-btn");
const aiInput = document.getElementById("ai-input");
const aiMessages = document.getElementById("ai-messages");
const suggestBtns = document.querySelectorAll(".suggest-btn");

// =========================
// Toggle Chatbox Visibility
// =========================
if (aiBtn) {
  aiBtn.addEventListener("click", () => {
    aiChatbox.classList.remove("d-none");
  });
}

if (closeAi) {
  closeAi.addEventListener("click", () => {
    aiChatbox.classList.add("d-none");
  });
}

// =========================
// Suggested Questions
// =========================
suggestBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    aiInput.value = btn.innerText;
    sendMessage();
  });
});

// =========================
// Send Message Function
// =========================
if (sendBtn) {
  sendBtn.addEventListener("click", sendMessage);
}

if (aiInput) {
  aiInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
}

async function sendMessage() {
  const text = aiInput.value.trim();
  if (!text) return;

  // 1. Tampilkan pesan user di UI
  addMessage(text, "user");
  aiInput.value = "";

  // 2. Tampilkan indikator loading / typing
  showTyping();

  try {
    // 3. Panggil Vercel Serverless Function (/api/chat)
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: text })
    });

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

      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const rawText = await response.text();

        throw new Error(
          rawText || `HTTP error ${response.status}`
        );
      }

      removeTyping();

      if (!response.ok || !data.success) {
        console.error("API Error Response:", data);

        addMessage(
          data.error ||
          "Maaf, Rifqi AI sedang mengalami gangguan.",
          "bot"
        );

        return;
      }

      addMessage(data.result, "bot");

    } catch (error) {
      console.error("Fetch error:", error);

      removeTyping();

      addMessage(
        "Maaf, gagal terhubung ke server AI.",
        "bot"
      );
    }
    removeTyping();

    if (response.ok && data.success) {
      // Tampilkan balasan cerdas dari Gemini AI
      addMessage(data.result, "bot");
    } else {
      console.error("API Error Response:", data);
      addMessage("Maaf, terjadi kendala saat menghubungkan ke AI. Silakan coba lagi nanti.", "bot");
    }

  } catch (error) {
    console.error("Fetch error:", error);
    removeTyping();
    addMessage("Maaf, gagal terhubung ke server AI.", "bot");
  }
}

// =========================
// UI Helpers
// =========================
function addMessage(text, type) {
  const div = document.createElement("div");
  div.classList.add("ai-message", type);
  
  // Format baris baru agar rapi di HTML
  div.innerHTML = text.replace(/\n/g, "<br>");

  aiMessages.appendChild(div);
  aiMessages.scrollTop = aiMessages.scrollHeight;
}

function showTyping() {
  const typing = document.createElement("div");
  typing.classList.add("ai-message", "bot", "typing-message");
  typing.innerHTML = "Rifqi AI sedang berpikir<span class='typing'></span>";
  aiMessages.appendChild(typing);
  aiMessages.scrollTop = aiMessages.scrollHeight;
}

function removeTyping() {
  const typing = document.querySelector(".typing-message");
  if (typing) {
    typing.remove();
  }
}