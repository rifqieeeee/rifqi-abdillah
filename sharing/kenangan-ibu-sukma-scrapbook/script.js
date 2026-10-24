const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  const opened = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(opened));
  menuToggle.setAttribute("aria-label", opened ? "Tutup navigasi" : "Buka navigasi");
  menuToggle.textContent = opened ? "×" : "☰";
});

mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Buka navigasi");
  menuToggle.textContent = "☰";
}));

const letterButton = document.getElementById("letterButton");
const hiddenMessage = document.getElementById("hiddenMessage");
letterButton.addEventListener("click", () => {
  const shown = hiddenMessage.classList.toggle("show");
  letterButton.innerHTML = shown ? 'Tutup pesan kecil <span>×</span>' : 'Ada satu hal lagi, Bu <span>♡</span>';
});

const memoryVideo = document.getElementById("memoryVideo");
const videoPlaceholder = document.getElementById("videoPlaceholder");
memoryVideo.addEventListener("loadedmetadata", () => videoPlaceholder.style.display = "none");
memoryVideo.addEventListener("canplay", () => videoPlaceholder.style.display = "none");
