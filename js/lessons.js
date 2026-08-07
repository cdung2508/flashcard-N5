import { vocabulary } from "../data/N5/vocab.js";

let currentLesson = "lesson1";
let vocab = shuffle(vocabulary[currentLesson] || []);
let index = 0;
let flipped = false;
let isQuizMode = false;
let correctCount = 0;
let totalCount = 0;

const card = document.getElementById("card");
const frontText = document.getElementById("frontText");
const backText = document.getElementById("backText");
const quizArea = document.getElementById("quizArea");
const quizInput = document.getElementById("quizInput");
const feedback = document.getElementById("feedback");
const summary = document.getElementById("summary");
const modeLabel = document.getElementById("modeLabel");
const direction = document.getElementById("direction");
const exampleBox = document.getElementById("exampleBox");
const exampleJp = document.getElementById("exampleJp");
const exampleVn = document.getElementById("exampleVn");

function shuffle(array) {
  if (!array || !Array.isArray(array)) return [];
  let newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function renderCard() {
  flipped = false;
  card.classList.remove("flipped");
  if (feedback) feedback.innerText = "";
  if (summary) summary.innerText = "";

  if (!vocab || vocab.length === 0) {
    frontText.innerText = "Chưa có dữ liệu bài này";
    backText.innerText = "";
    if (exampleBox) exampleBox.style.display = "none";
    return;
  }

  const dir = direction.value;
  const word = vocab[index];
  if (!word) return;

  if (word.example && word.example.jp) {
    exampleBox.style.display = "block";
    exampleJp.innerHTML = `<strong>例:</strong> ${word.example.jp}`;
    exampleVn.innerHTML = `<strong>意味:</strong> ${word.example.vn || ''}`;
  } else {
    exampleBox.style.display = "none";
  }

  frontText.innerText = dir === "jp-vn" ? word.jp : word.vn;
  backText.innerText = dir === "jp-vn" ? word.vn : word.jp;
  if (quizInput) {
    quizInput.value = "";
  }
}

function flipCard() {
  if (isQuizMode) return;
  flipped = !flipped;
  card.classList.toggle("flipped");
}

function nextCard() {
  if (!vocab || vocab.length === 0) return;
  index = (index + 1) % vocab.length;
  renderCard();
}

function prevCard() {
  if (!vocab || vocab.length === 0) return;
  index = (index - 1 + vocab.length) % vocab.length;
  renderCard();
}

function changeLesson() {
  const lessonSelect = document.getElementById("lesson");
  if (lessonSelect) {
    currentLesson = lessonSelect.value;
  }
  const lessonData = vocabulary[currentLesson] || [];
  vocab = shuffle(lessonData);
  index = 0;
  renderCard();
}

function toggleMode() {
  isQuizMode = !isQuizMode;
  if (modeLabel) modeLabel.innerText = isQuizMode ? "Kiểm tra" : "Học từ";
  if (quizArea) quizArea.style.display = isQuizMode ? "block" : "none";
  correctCount = 0;
  totalCount = 0;
  const lessonData = vocabulary[currentLesson] || [];
  vocab = shuffle(lessonData);
  index = 0;
  renderCard();
}

function checkAnswer() {
  if (!vocab || vocab.length === 0) return;
  const userInput = quizInput.value.trim().toLowerCase();
  const dir = direction.value;
  const word = vocab[index];
  const correctAnswer = (dir === "jp-vn" ? word.vn : word.jp).toLowerCase();
  totalCount++;

  if (userInput === correctAnswer) {
    feedback.innerText = "✅ Chính xác!";
    feedback.style.color = "green";
    correctCount++;
  } else {
    feedback.innerText = `❌ Sai! Đáp án đúng: ${correctAnswer}`;
    feedback.style.color = "red";
  }

  summary.innerText = `Đúng ${correctCount}/${totalCount}`;
}

// Gán sự kiện
const lessonSelectEl = document.getElementById("lesson");
if (lessonSelectEl) {
  lessonSelectEl.addEventListener("change", changeLesson);
}

if (direction) {
  direction.addEventListener("change", renderCard);
}

const btnToggleMode = document.getElementById("btnToggleMode");
if (btnToggleMode) {
  btnToggleMode.addEventListener("click", toggleMode);
}

const cardContainerEl = document.getElementById("cardContainer");
if (cardContainerEl) {
  cardContainerEl.addEventListener("click", flipCard);
}

const btnCheckAnswerEl = document.getElementById("btnCheckAnswer");
if (btnCheckAnswerEl) {
  btnCheckAnswerEl.addEventListener("click", checkAnswer);
}

const btnPrevEl = document.getElementById("btnPrev");
if (btnPrevEl) {
  btnPrevEl.addEventListener("click", prevCard);
}

const btnNextEl = document.getElementById("btnNext");
if (btnNextEl) {
  btnNextEl.addEventListener("click", nextCard);
}

// Khởi chạy hiển thị thẻ đầu tiên
renderCard();

// Service Worker Registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log("SW registered"))
    .catch(err => console.error("SW failed:", err));
}