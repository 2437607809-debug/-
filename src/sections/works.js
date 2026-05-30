import { initCardTilt } from '../components/card-tilt.js';

/**
 * 渲染作品卡片
 * @param {Array} items - 作品列表
 * @param {Array} categories - 分类列表
 * @param {Object} workCovers - { workId: base64 } 封面图映射
 */
export function renderWorks(items, categories, workCovers = {}) {
  const grid = document.getElementById('worksGrid');
  if (!grid) return;

  // 渲染筛选栏
  if (categories) {
    const filterBar = document.getElementById('filterBar');
    if (filterBar) {
      filterBar.innerHTML = categories
        .map((c, i) =>
          `<button class="filter-btn${i === 0 ? ' active' : ''}" data-filter="${c}">${c}</button>`
        )
        .join('');

      filterBar.querySelectorAll('.filter-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          filterWorks(btn.dataset.filter);
        });
      });
    }
  }

  // 渲染卡片
  grid.innerHTML = items
    .map((item, index) => {
      const coverSrc = workCovers[item.id] || item.cover || '';
      const coverHTML = coverSrc
        ? `<img src="${coverSrc}" alt="${item.title}" class="work-cover" loading="lazy" />`
        : `<div class="work-cover-placeholder">🖼️</div>`;

      return `
      <div class="work-card" data-category="${item.category}" style="--card-index: ${index}">
        ${coverHTML}
        <div class="work-info">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <div class="work-tags">
            ${(item.tags || []).map(t => `<span class="work-tag">${t}</span>`).join('')}
          </div>
        </div>
      </div>`;
    })
    .join('');

  // 入场动画
  setTimeout(() => {
    grid.querySelectorAll('.work-card').forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.08}s`;
      card.classList.add('card-visible');
    });
  }, 100);

  // 卡片倾斜效果
  grid.querySelectorAll('.work-card').forEach(card => initCardTilt(card));

  // 卡片点击跳转
  grid.querySelectorAll('.work-card').forEach((card, i) => {
    card.addEventListener('click', () => {
      const link = items[i]?.link;
      if (link) window.open(link, '_blank');
    });
  });
}

function filterWorks(category) {
  const cards = document.querySelectorAll('.work-card');
  cards.forEach(card => card.classList.remove('card-visible'));

  setTimeout(() => {
    cards.forEach(card => {
      if (category === '全部' || card.dataset.category === category) {
        card.style.display = '';
        requestAnimationFrame(() => card.classList.add('card-visible'));
      } else {
        card.style.display = 'none';
      }
    });
  }, 150);
}
