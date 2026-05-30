/**
 * 导航栏滚动高亮与模糊过渡
 */
export function initNavigation() {
  const navbar = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-link');
  const sections = [];

  links.forEach((link) => {
    const id = link.getAttribute('href').slice(1);
    const section = document.getElementById(id);
    if (section) sections.push({ link, section });
  });

  function update() {
    const scrollY = window.scrollY;

    // 导航毛玻璃加深
    navbar.classList.toggle('scrolled', scrollY > 50);

    // 当前区域高亮
    let current = sections[0]?.link;
    sections.forEach(({ link, section }) => {
      const top = section.offsetTop - 100;
      if (scrollY >= top) current = link;
    });

    links.forEach((l) => l.classList.remove('active'));
    if (current) current.classList.add('active');
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}
