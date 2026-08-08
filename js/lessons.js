// Dynamic vocab loading theo cấp độ JLPT

let currentLevel = localStorage.getItem('currentLevel') || 'N5';
let currentLesson = "";
let vocabulary = {};
let vocab = [];
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
const lessonSelectEl = document.getElementById("lesson");

function shuffle(array) {
  if (!array || !Array.isArray(array)) return [];
  let newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Load vocab data theo cấp độ JLPT (dynamic import)
 */
async function loadVocabulary(level) {
  try {
    let module;
    switch (level) {
      case 'N4':
        module = await import("../data/N4/vocab.js");
        break;
      case 'N5':
      default:
        module = await import("../data/N5/vocab.js");
        break;
    }

    // Lấy object vocabulary từ module (hỗ trợ cả vocabularyN5 và vocabularyN4)
    vocabulary =  module.vocabulary || {};
    return vocabulary;
  } catch (err) {
    console.error(`Không thể load vocab cho ${level}:`, err);
    vocabulary = {};
    return vocabulary;
  }
}

/**
 * Cập nhật dropdown bài học dựa trên dữ liệu đã load
 */
function populateLessonDropdown() {
  if (!lessonSelectEl) return;

  // Xóa hết option cũ
  lessonSelectEl.innerHTML = "";

  // Lấy danh sách lesson keys từ vocabulary đã load
  const lessonKeys = Object.keys(vocabulary);
  if (lessonKeys.length === 0) return;

  // Sắp xếp theo số thứ tự bài
  lessonKeys.sort((a, b) => {
    const numA = parseInt(a.replace('lesson', ''));
    const numB = parseInt(b.replace('lesson', ''));
    return numA - numB;
  });

  // Thêm option mới
  lessonKeys.forEach(key => {
    const num = key.replace('lesson', '');
    const option = document.createElement("option");
    option.value = key;
    option.textContent = `Bài ${num}`;
    lessonSelectEl.appendChild(option);
  });

  // Mặc định chọn bài đầu tiên
  currentLesson = lessonKeys[0];
  lessonSelectEl.value = currentLesson;
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
  if (lessonSelectEl) {
    currentLesson = lessonSelectEl.value;
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

/**
 * Đổi cấp độ: load vocab mới + cập nhật dropdown + load bài đầu tiên
 */
async function handleLevelChange(level) {
  currentLevel = level;
  await loadVocabulary(level);
  populateLessonDropdown();
  changeLesson();
}

// Gán sự kiện
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

// Lắng nghe sự kiện đổi cấp độ từ navbar
window.addEventListener('levelChanged', (e) => {
  handleLevelChange(e.detail.level);
});

// Khởi chạy: load vocab theo cấp độ hiện tại + hiển thị
async function init() {
  await loadVocabulary(currentLevel);
  populateLessonDropdown();
  changeLesson();
}

init();

// Service Worker Registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log("SW registered"))
    .catch(err => console.error("SW failed:", err));
}