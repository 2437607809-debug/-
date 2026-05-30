/**
 * 滚动监听：入场动画 + 滚动进度 + 视差效果
 */
export function initScrollObserver() {
  // 为需要入场动画的元素添加 reveal 类
  const revealTargets = document.querySelectorAll(
    '.glass-card, .section-title, .hero-title, .hero-subtitle, .hero-desc, .hero-cta'
  );

  revealTargets.forEach((el) => {
    el.classList.add('reveal');
  });

  // 左右入场
  document.querySelector('.about-avatar-col')?.classList.add('reveal-left');
  document.querySelector('.info-card')?.classList.add('reveal-right');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealTargets.forEach((el) => observer.observe(el));
  document.querySelector('.about-avatar-col') && observer.observe(document.querySelector('.about-avatar-col'));
  document.querySelector('.info-card') && observer.observe(document.querySelector('.info-card'));

  // 视差效果
  const parallaxElements = document.querySelectorAll('.avatar-ring, .work-cover-placeholder');
  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;

    parallaxElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const offset = (centerY - viewportCenter) * 0.1;

      el.style.transform = `translateY(${offset}px)`;
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}
