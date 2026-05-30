/**
 * 打字机效果
 * @param {string} elementId - 目标元素 ID
 * @param {string} text - 要显示的文字
 * @param {number} speed - 基础打字速度 (ms/字)
 */
export function initTypewriter(elementId, text, speed = 80) {
  const el = document.getElementById(elementId);
  if (!el) return;

  let index = 0;
  el.textContent = '';

  function getRandomDelay() {
    return speed + (Math.random() - 0.5) * 40;
  }

  function type() {
    if (index < text.length) {
      const char = text.charAt(index);
      el.textContent += char;
      index++;

      let delay = getRandomDelay();

      if (char === ' ' || char === '-' || char === "'") {
        delay = speed * 0.3;
      } else if (['.', ',', '!', '?', ':'].includes(char)) {
        delay = speed * 3;
      }

      setTimeout(type, delay);
    }
  }

  setTimeout(type, 600);
}
