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
  } catch (error) {
    console.error('Không thể load navbar:', error);
  }
}

// Chạy hàm loadNavbar
// Lấy tên trang hiện tại từ attribute trên <body> hoặc truyền trực tiếp
const activePage = document.body.dataset.page;
loadNavbar(activePage);