/**
 * 3D 卡片倾斜效果 + 光泽扫过 + 光晕
 */
export function initCardTilt(card) {
  let rafId = null;
  let currentRotX = 0, currentRotY = 0;
  let targetRotX = 0, targetRotY = 0;

  // 光泽扫过元素
  const glare = document.createElement('div');
  glare.className = 'card-glare';
  glare.style.cssText = `
    position: absolute; inset: 0; pointer-events: none; z-index: 1;
    opacity: 0; transition: opacity 0.3s;
  `;
  card.style.position = card.style.position || 'relative';
  card.style.overflow = 'hidden';
  card.appendChild(glare);

  function updateGlare(x, y, w, h) {
    const gradient = `
      radial-gradient(
        circle at ${x}px ${y}px,
        rgba(255, 255, 255, 0.12) 0%,
        rgba(255, 255, 255, 0.03) 40%,
        transparent 70%
      )
    `;
    glare.style.background = gradient;
  }

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    targetRotY = ((x - centerX) / centerX) * 10;
    targetRotX = -((y - centerY) / centerY) * 10;

    updateGlare(x, y, rect.width, rect.height);
    glare.style.opacity = '1';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'none';
    if (!rafId) animate();
  });

  card.addEventListener('mouseleave', () => {
    targetRotX = 0;
    targetRotY = 0;
    glare.style.opacity = '0';
    card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  });

  function animate() {
    currentRotX += (targetRotX - currentRotX) * 0.12;
    currentRotY += (targetRotY - currentRotY) * 0.12;

    card.style.transform = `perspective(1000px) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;

    if (Math.abs(currentRotX - targetRotX) > 0.01 ||
        Math.abs(currentRotY - targetRotY) > 0.01) {
      rafId = requestAnimationFrame(animate);
    } else {
      rafId = null;
    }
  }
}
