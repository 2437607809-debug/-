let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;
let glow2X = 0, glow2Y = 0;
const smoothing = 0.08;
const smoothing2 = 0.05;

export function initMouseGlow() {
  const glow = document.createElement('div');
  glow.className = 'mouse-glow';
  document.body.appendChild(glow);

  const glow2 = document.createElement('div');
  glow2.className = 'mouse-glow-secondary';
  document.body.appendChild(glow2);

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
    glow2.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    glow.style.opacity = '1';
    glow2.style.opacity = '1';
  });

  function animate() {
    glowX += (mouseX - glowX) * smoothing;
    glowY += (mouseY - glowY) * smoothing;
    glow2X += (mouseX - glow2X) * smoothing2;
    glow2Y += (mouseY - glow2Y) * smoothing2;

    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    glow2.style.left = glow2X + 'px';
    glow2.style.top = glow2Y + 'px';

    requestAnimationFrame(animate);
  }

  animate();
}
