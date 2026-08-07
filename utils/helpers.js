// js/storage.js - Quản lý Trạng thái Trình độ dùng chung

const DEFAULT_LEVEL = 'N5';
const VALID_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

/**
 * Lấy trình độ hiện tại của người dùng
 */
export function getCurrentLevel() {
  const savedLevel = localStorage.getItem('userLevel');
  return VALID_LEVELS.includes(savedLevel) ? savedLevel : DEFAULT_LEVEL;
}

/**
 * Cập nhật trình độ mới và bắn sự kiện cho toàn app biết
 */
export function setCurrentLevel(newLevel) {
  if (!VALID_LEVELS.includes(newLevel)) return;
  
  localStorage.setItem('userLevel', newLevel);
  
  // Bắn Custom Event để các trang/component đang mở có thể tự cập nhật UI mà không cần reload
  window.dispatchEvent(new CustomEvent('levelChanged', { detail: { level: newLevel } }));
}