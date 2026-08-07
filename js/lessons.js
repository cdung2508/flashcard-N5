import { vocabulary  } from "../data/N5/vocab.js";

let currentLesson = "lesson1";
let vocab = shuffle(vocabulary[currentLesson]);
let index = 0;
let flipped = false;
let isQuizMode = false;
let correctCount = 0;
let totalCount = 0;

console.log("HERE", vocabulary)
console.log("HERE 1", vocab)

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
  feedback.innerText = "";
  summary.innerText = "";
  const dir = direction.value;
  const word = vocab[index];

  if (word.example) {
    exampleBox.style.display = "block";
    exampleJp.innerHTML = `<strong>例:</strong> ${word.example.jp}`;
    exampleVn.innerHTML = `<strong>意味:</strong> ${word.example.vn}`;
  } else {
    exampleBox.style.display = "none";
  }

  frontText.innerText = dir === "jp-vn" ? word.jp : word.vn;
  backText.innerText = dir === "jp-vn" ? word.vn : word.jp;
  quizInput.value = "";
  quizInput.focus();
}

function flipCard() {
  if (isQuizMode) return;
  flipped = !flipped;
  card.classList.toggle("flipped");
}

function nextCard() {
  index = (index + 1) % vocab.length;
  renderCard();
}

function prevCard() {
  index = (index - 1 + vocab.length) % vocab.length;
  renderCard();
}

function changeLesson() {
  currentLesson = document.getElementById("lesson").value;
  vocab = shuffle(vocab[currentLesson]);
  index = 0;
  renderCard();
}

function toggleMode() {
  isQuizMode = !isQuizMode;
  if (modeLabel) modeLabel.innerText = isQuizMode ? "Kiểm tra" : "Học từ";
  quizArea.style.display = isQuizMode ? "block" : "none";
  correctCount = 0;
  totalCount = 0;
  vocab = shuffle(vocab[currentLesson]);
  index = 0;
  renderCard();
}

function checkAnswer() {
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

document.getElementById("lesson").addEventListener("change", changeLesson);
direction.addEventListener("change", renderCard);

// Khởi chạy hiển thị thẻ đầu tiên
renderCard();

// Service Worker Registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/flashcard-N5/sw.js')
    .then(() => console.log("SW registered"))
    .catch(err => console.error("SW failed:", err));
}

// Gán sự kiện (Event Listeners)
document.getElementById("cardContainer").addEventListener("click", flipCard);
document.getElementById("btnCheckAnswer").addEventListener("click", checkAnswer);
document.getElementById("btnPrev").addEventListener("click", prevCard);
document.getElementById("btnNext").addEventListener("click", nextCard);