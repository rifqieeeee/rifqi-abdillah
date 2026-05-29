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

// =========================
// Knowledge Base JSON Loader
// =========================

let knowledge = [];

async function loadKnowledgeBase() {

  try {

    const response = await fetch("assets/data/knowledge.json");

    knowledge = await response.json();

    console.log("Knowledge base loaded successfully");

  } catch (error) {

    console.error("Failed to load knowledge base:", error);

  }

}

loadKnowledgeBase();

// =========================
// Open / Close Chat
// =========================

aiBtn.addEventListener("click", () => {
  aiChatbox.classList.remove("d-none");
});

closeAi.addEventListener("click", () => {
  aiChatbox.classList.add("d-none");
});

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
// Send Message
// =========================

sendBtn.addEventListener("click", sendMessage);

aiInput.addEventListener("keypress", (e) => {

  if (e.key === "Enter") {
    sendMessage();
  }

});

function sendMessage() {

  const text = aiInput.value.trim();

  if (!text) return;

  addMessage(text, "user");

  aiInput.value = "";

  showTyping();

  setTimeout(() => {

    removeTyping();

    const response = getAIResponse(text);

    addMessage(response, "bot");

  }, 1000);

}

// =========================
// AI Response Engine
// =========================

function getAIResponse(message) {

  const msg = message.toLowerCase();

  for (let item of knowledge) {

    for (let keyword of item.keywords) {

      if (msg.includes(keyword)) {

        return randomAnswer(item.answers);

      }

    }

  }

  return "Sorry, I don't understand that yet. Please ask about research, publications, projects, or collaboration.";

}

// =========================
// Random Answer
// =========================

function randomAnswer(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// =========================
// Add Message
// =========================

function addMessage(text, type) {

  const div = document.createElement("div");

  div.classList.add("ai-message", type);

  div.innerHTML = text;

  aiMessages.appendChild(div);

  aiMessages.scrollTop = aiMessages.scrollHeight;

}

// =========================
// Typing Animation
// =========================

function showTyping() {

  const typing = document.createElement("div");

  typing.classList.add("ai-message", "bot", "typing-message");

  typing.innerHTML = "Rifqi AI is typing<span class='typing'></span>";

  aiMessages.appendChild(typing);

  aiMessages.scrollTop = aiMessages.scrollHeight;

}

function removeTyping() {

  const typing = document.querySelector(".typing-message");

  if (typing) {
    typing.remove();
  }

}
