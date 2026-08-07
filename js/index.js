// ==========================================
// TRANG CHỦ (INDEX PAGE LOGIC)
// ==========================================

// Lắng nghe sự kiện đổi Trình độ JLPT từ Navbar để cập nhật lại giao diện nếu cần
window.addEventListener('levelChanged', (e) => {
  const selectedLevel = e.detail.level;
  console.log(`[Trang chủ] Trình độ JLPT vừa thay đổi thành: ${selectedLevel}`);
});