// ==========================================
// QUẢN LÝ CHỌN TRÌNH ĐỘ (JLPT LEVEL)
// ==========================================

// Danh sách Level hợp lệ
const VALID_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const DEFAULT_LEVEL = 'N5';

/**
 * Hàm lấy Level an toàn (có check validation)
 */
function getValidLevel() {
  const savedLevel = localStorage.getItem('currentLevel');
  if (VALID_LEVELS.includes(savedLevel)) {
    return savedLevel;
  }
  // Nếu giá trị không hợp lệ hoặc chưa có, set mặc định N5
  localStorage.setItem('currentLevel', DEFAULT_LEVEL);
  return DEFAULT_LEVEL;
}

// DOM Elements
const levelModal = document.getElementById('levelModal');
const openModalBtn = document.getElementById('openLevelModalBtn');
const closeModalBtn = document.getElementById('closeLevelModalBtn');
const currentLevelText = document.getElementById('currentLevelText');
const levelBtns = document.querySelectorAll('.level-btn');

/**
 * Cập nhật Giao diện theo Level được chọn
 */
function updateUILevel(level) {
  if (currentLevelText) {
    currentLevelText.textContent = `JP JLPT ${level}`;
  }
  
  levelBtns.forEach(btn => {
    if (btn.dataset.level === level) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

/**
 * Hàm mở/đóng Modal mượt mà (Dùng class active để kích hoạt CSS Animation)
 */
function openModal() {
  if (levelModal) levelModal.classList.add('active');
}

function closeModal() {
  if (levelModal) levelModal.classList.remove('active');
}

// Khởi tạo Level khi load trang
const currentLevel = getValidLevel();
updateUILevel(currentLevel);

// --- EVENT HANDLERS ---

// Mở Modal
if (openModalBtn) {
  openModalBtn.addEventListener('click', openModal);
}

// Đóng Modal bằng nút X
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', closeModal);
}

// Đóng Modal khi bấm ra ngoài phần phông nền mờ
if (levelModal) {
  levelModal.addEventListener('click', (e) => {
    if (e.target === levelModal) {
      closeModal();
    }
  });
}

// Xử lý khi bấm chọn Level
levelBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const selectedLevel = btn.dataset.level;
    
    if (VALID_LEVELS.includes(selectedLevel)) {
      // 1. Lưu vào LocalStorage
      localStorage.setItem('currentLevel', selectedLevel);
      
      // 2. Cập nhật UI nút bấm & Badge
      updateUILevel(selectedLevel);
      
      // 3. Đóng Modal
      closeModal();

      // 4. Phát sự kiện (CustomEvent) thông báo level đã đổi
      // Giúp các trang khác hoặc các module khác re-render dữ liệu nếu cần
      window.dispatchEvent(new CustomEvent('levelChanged', { detail: { level: selectedLevel } }));
    }
  });
});