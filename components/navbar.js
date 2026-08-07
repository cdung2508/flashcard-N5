const VALID_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const DEFAULT_LEVEL = 'N5';

/**
 * Lấy trình độ an toàn từ localStorage
 */
function getValidLevel() {
  const savedLevel = localStorage.getItem('currentLevel');
  if (VALID_LEVELS.includes(savedLevel)) {
    return savedLevel;
  }
  localStorage.setItem('currentLevel', DEFAULT_LEVEL);
  return DEFAULT_LEVEL;
}

/**
 * Khởi tạo sự kiện & giao diện cho Modal Chọn Trình độ trên Navbar
 */
function initLevelSelector() {
  const levelModal = document.getElementById('levelModal');
  const openModalBtn = document.getElementById('openLevelModalBtn');
  const closeModalBtn = document.getElementById('closeLevelModalBtn');
  const currentLevelText = document.getElementById('currentLevelText');
  const levelBtns = document.querySelectorAll('.level-btn');

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

  function openModal() {
    if (levelModal) levelModal.classList.add('active');
  }

  function closeModal() {
    if (levelModal) levelModal.classList.remove('active');
  }

  // Set level ban đầu
  const currentLevel = getValidLevel();
  updateUILevel(currentLevel);

  // Gán sự kiện mở/đóng modal
  if (openModalBtn) openModalBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  
  if (levelModal) {
    levelModal.addEventListener('click', (e) => {
      if (e.target === levelModal) closeModal();
    });
  }

  // Sự kiện chọn Level
  levelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLevel = btn.dataset.level;
      
      if (VALID_LEVELS.includes(selectedLevel)) {
        localStorage.setItem('currentLevel', selectedLevel);
        updateUILevel(selectedLevel);
        closeModal();

        // Phát Custom Event cho các trang khác re-render nếu cần
        window.dispatchEvent(new CustomEvent('levelChanged', { detail: { level: selectedLevel } }));
      }
    });
  });
}

async function loadNavbar(activePage) {
  try {
    const response = await fetch('components/navbar.html');
    const navbarHtml = await response.text();
    
    // Chèn HTML vào vị trí mong muốn (đầu <body>)
    document.body.insertAdjacentHTML('afterbegin', navbarHtml);

    // Tự động active menu tương ứng với trang hiện tại
    if (activePage) {
      const activeItem = document.querySelector(`.nav-item[data-page="${activePage}"]`);
      if (activeItem) {
        activeItem.classList.add('active');
      }
    }

    // Kích hoạt logic chọn trình độ
    initLevelSelector();
  } catch (error) {
    console.error('Không thể load navbar:', error);
  }
}

// Chạy hàm loadNavbar
const activePage = document.body.dataset.page;
loadNavbar(activePage);