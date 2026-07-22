const preloader = document.getElementById("preloader");
window.addEventListener("load", () => setTimeout(() => preloader.classList.add("hide"), 600));

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
document.querySelectorAll(".nav-links a").forEach(link => link.addEventListener("click", () => navLinks.classList.remove("open")));

const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
let isPlaying = false;

musicBtn.addEventListener("click", async () => {
  try {
    if (!isPlaying) {
      await music.play();
      musicBtn.classList.add("playing");
      isPlaying = true;
    } else {
      music.pause();
      musicBtn.classList.remove("playing");
      isPlaying = false;
    }
  } catch (err) {
    alert("Browser memblokir autoplay. Tap sekali lagi tombol musiknya ya.");
  }
});

const startDate = new Date("2025-06-23T22:00:00");
function updateLoveTimer() {
  const now = new Date();
  const diff = Math.max(0, now - startDate);
  document.getElementById("days").textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
  document.getElementById("hours").textContent = Math.floor((diff / (1000 * 60 * 60)) % 24);
  document.getElementById("minutes").textContent = Math.floor((diff / (1000 * 60)) % 60);
  document.getElementById("seconds").textContent = Math.floor((diff / 1000) % 60);
}
updateLoveTimer();
setInterval(updateLoveTimer, 1000);

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("show");
  });
}, { threshold: 0.15 });
reveals.forEach(item => observer.observe(item));

const filterButtons = document.querySelectorAll(".filter-btn");
const photoCards = [...document.querySelectorAll(".photo-card")];
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    photoCards.forEach(card => {
      const show = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hide", !show);
    });
  });
});

const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const closeModal = document.getElementById("closeModal");
const prevImg = document.getElementById("prevImg");
const nextImg = document.getElementById("nextImg");
let currentIndex = 0;

function visibleCards() {
  return photoCards.filter(card => !card.classList.contains("hide"));
}
function openModal(index) {
  const cards = visibleCards();
  const card = cards[index];
  if (!card) return;
  currentIndex = index;
  const img = card.querySelector("img");
  modalImg.src = img.src;
  modalTitle.textContent = card.querySelector("h3").textContent;
  modalDesc.textContent = card.querySelector("p").textContent;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeImageModal() {
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
}
function moveModal(step) {
  const cards = visibleCards();
  currentIndex = (currentIndex + step + cards.length) % cards.length;
  openModal(currentIndex);
}

photoCards.forEach(card => {
  card.addEventListener("click", () => openModal(visibleCards().indexOf(card)));
});
closeModal.addEventListener("click", closeImageModal);
prevImg.addEventListener("click", () => moveModal(-1));
nextImg.addEventListener("click", () => moveModal(1));
modal.addEventListener("click", e => { if (e.target === modal) closeImageModal(); });
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeImageModal();
  if (e.key === "ArrowLeft" && modal.classList.contains("active")) moveModal(-1);
  if (e.key === "ArrowRight" && modal.classList.contains("active")) moveModal(1);
});
