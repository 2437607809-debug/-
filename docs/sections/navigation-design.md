# 导航与交互设计文档

## 导航栏设计

### 区域概述

导航栏是整个网站的脉络系统，承担着页面导航、区域跳转和主题切换的核心功能。采用固定定位设计，确保用户随时可以快速访问各个区域，同时通过毛玻璃效果保持与背景的视觉融合。

## 视觉结构

```
┌─────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────┐   │
│  │ PORTFOLIO │ 首页 │ 关于 │ 作品 │ 联系 │ [主题] │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
          ↑ 固定在顶部，滚动时保持可见
```

### 布局结构

```html
<header class="navbar" id="navbar">
  <div class="nav-inner">
    <a href="#hero" class="nav-logo">PORTFOLIO</a>
    <nav class="nav-links">
      <a href="#hero" class="nav-link active">首页</a>
      <a href="#about" class="nav-link">关于</a>
      <a href="#works" class="nav-link">作品</a>
      <a href="#contact" class="nav-link">联系</a>
    </nav>
    <button class="theme-btn" id="themeToggle" aria-label="切换背景主题">
      <svg>...</svg>
    </button>
  </div>
</header>
```

### 尺寸规范

| 元素 | 桌面端 | 移动端 |
|------|--------|--------|
| 导航栏高度 | 64px | 56px |
| 内容最大宽度 | 1200px | 100% |
| 内边距 | 0 24px | 0 16px |
| Logo字号 | 1.2rem | 1rem |
| 链接字号 | 0.9rem | 0.8rem |
| 链接间距 | 32px | 16px |

## 核心样式

### 基础样式

```css
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: var(--nav-height);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  background: rgba(5, 5, 16, 0.5);
  border-bottom: 1px solid var(--color-glass-border);
  transition: background 0.3s, border-color 0.3s;
}
```

### 滚动增强效果

```css
.navbar.scrolled {
  background: rgba(5, 5, 16, 0.8);
  border-bottom-color: rgba(255, 255, 255, 0.15);
}
```

**触发条件：**

```javascript
navbar.classList.toggle('scrolled', scrollY > 50);
```

### 导航内部布局

```css
.nav-inner {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

## Logo设计

### 样式规范

```css
.nav-logo {
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--color-text);
  transition: color 0.3s;
}

.nav-logo:hover {
  color: var(--color-accent);
}
```

### 设计说明

- 字重：700（Bold）
- 字间距：0.15em（增加精致感）
- 悬停变色：从白色过渡到强调色
- 过渡时长：0.3s

## 导航链接

### 链接样式

```css
.nav-link {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  position: relative;
  padding: 4px 0;
  transition: color 0.3s;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-accent);
  transition: width 0.3s;
}
```

### 悬停和激活状态

```css
.nav-link:hover,
.nav-link.active {
  color: var(--color-text);
}

.nav-link.active::after {
  width: 100%;
}
```

### 交互行为

1. **默认状态**：文字灰色，无下划线
2. **悬停状态**：文字变白，显示下划线动画
3. **激活状态**：文字白色，下划线持续显示

## 主题切换按钮

### 按钮设计

```css
.theme-btn {
  background: var(--color-glass);
  border: 1px solid var(--color-glass-border);
  color: var(--color-text-secondary);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.theme-btn:hover {
  color: var(--color-text);
  background: var(--color-glass-hover);
  border-color: var(--color-accent);
}
```

### 图标设计

使用内联SVG太阳图标：

```html
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="5"/>
  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
</svg>
```

### 交互功能

```javascript
export function initThemeSwitcher() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const themes = ['fluid', 'cosmos', 'ocean'];
  let idx = 0;

  btn.addEventListener('click', () => {
    idx = (idx + 1) % themes.length;
    const theme = themes[idx];
    switchTheme(theme);
    console.log(`[Theme] 切换主题: ${theme}`);
  });
}
```

## 滚动高亮逻辑

### 功能描述

根据当前滚动位置，自动高亮对应的导航链接，让用户清楚知道自己所在的区域。

### 实现代码

```javascript
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
```

### 逻辑说明

1. **收集映射**：将每个链接与对应的区域元素关联
2. **计算位置**：获取每个区域距离顶部的偏移量
3. **判断高亮**：滚动位置超过区域顶部100px时，该链接高亮
4. **被动监听**：使用`passive: true`优化滚动性能

### 参数调整

| 参数 | 数值 | 说明 |
|------|------|------|
| 滚动阈值 | 50px | 毛玻璃加深的触发点 |
| 高亮偏移 | 100px | 提前触发高亮的缓冲距离 |

## 鼠标跟随光效

### 功能概述

鼠标在页面移动时，产生柔和的光晕效果跟随鼠标，增强页面的动感和沉浸感。

### 光效类型

| 光效 | 尺寸 | 颜色 | 混合模式 | 平滑系数 |
|------|------|------|----------|----------|
| 主光晕 | 400px | rgba(233,69,96,0.15) | screen | 0.08 |
| 次光晕 | 300px | rgba(15,52,96,0.2) | screen | 0.05 |

### 实现代码

```javascript
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;
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
```

### CSS样式

```css
.mouse-glow {
  position: fixed;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(233, 69, 96, 0.15) 0%, transparent 70%);
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease;
  z-index: 0;
  mix-blend-mode: screen;
}

.mouse-glow-secondary {
  position: fixed;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(15, 52, 96, 0.2) 0%, transparent 70%);
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease;
  z-index: 0;
  mix-blend-mode: screen;
}
```

### 性能优化

1. **requestAnimationFrame**：确保流畅的动画帧率
2. **被动事件监听**：提高滚动性能
3. **条件禁用**：移动端关闭光效以节省性能

## 滚动入场动画

### 功能概述

当页面元素进入视口时，触发淡入和上浮的动画效果，增强页面的层次感和动态感。

### 实现代码

```javascript
export function initScrollObserver() {
  const revealTargets = document.querySelectorAll(
    '.glass-card, .section-title, .hero-title, .hero-subtitle, .hero-desc, .hero-cta'
  );

  revealTargets.forEach((el) => {
    el.classList.add('reveal');
  });

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
}
```

### 动画类型

| 动画类型 | 初始状态 | 最终状态 | 时长 | 触发方向 |
|----------|----------|----------|------|----------|
| reveal | opacity: 0, translateY: 40px | opacity: 1, translateY: 0 | 0.8s | 从下 |
| reveal-left | opacity: 0, translateX: -40px | opacity: 1, translateX: 0 | 0.8s | 从左 |
| reveal-right | opacity: 0, translateX: 40px | opacity: 1, translateX: 0 | 0.8s | 从右 |

### CSS实现

```css
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

.reveal-left {
  opacity: 0;
  transform: translateX(-40px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.reveal-left.visible {
  opacity: 1;
  transform: translateX(0);
}

.reveal-right {
  opacity: 0;
  transform: translateX(40px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.reveal-right.visible {
  opacity: 1;
  transform: translateX(0);
}
```

### 参数配置

| 参数 | 数值 | 说明 |
|------|------|------|
| threshold | 0.15 | 元素15%可见时触发 |
| rootMargin | 0px 0px -40px 0px | 提前40px触发 |

## 视差滚动效果

### 功能概述

某些元素在滚动时产生轻微的位置偏移，创造深度感和层次感。

### 实现代码

```javascript
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
```

### 性能优化

1. **节流处理**：使用requestAnimationFrame
2. **被动监听**：passive: true提高滚动性能
3. **选择器优化**：仅对必要元素应用视差

## 全局交互规范

### 平滑滚动

```css
html {
  scroll-behavior: smooth;
  scroll-padding-top: var(--nav-height);
}
```

### 焦点管理

确保所有交互元素可键盘访问：

```css
*:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

*:focus:not(:focus-visible) {
  outline: none;
}
```

### 减少动画

尊重用户的减少动画偏好：

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 移动端适配

### 响应式断点

```css
@media (max-width: 640px) {
  :root {
    --nav-height: 56px;
  }

  .nav-links {
    gap: 16px;
  }

  .nav-link {
    font-size: 0.8rem;
  }
}
```

### 移动端优化

1. **导航高度减小**：从64px调整为56px
2. **链接间距减小**：从32px调整为16px
3. **字体略微缩小**：从0.9rem调整为0.8rem

## 无障碍设计

### 语义化HTML

```html
<header class="navbar" id="navbar" role="banner">
  <div class="nav-inner">
    <a href="#hero" class="nav-logo" role="link">PORTFOLIO</a>
    <nav class="nav-links" role="navigation" aria-label="主导航">
      <a href="#hero" class="nav-link active" aria-current="page">首页</a>
      <a href="#about" class="nav-link">关于</a>
      <a href="#works" class="nav-link">作品</a>
      <a href="#contact" class="nav-link">联系</a>
    </nav>
    <button class="theme-btn" id="themeToggle" aria-label="切换背景主题">
      <svg aria-hidden="true">...</svg>
    </button>
  </div>
</header>
```

### ARIA属性

| 属性 | 元素 | 说明 |
|------|------|------|
| role="banner" | header | 标识为横幅区域 |
| role="navigation" | nav | 标识为导航区域 |
| aria-label | nav | 提供导航区域描述 |
| aria-current="page" | 当前链接 | 标识当前页面 |
| aria-label | button | 为按钮提供描述 |

### 键盘导航

1. **Tab键**：按顺序访问所有链接和按钮
2. **Enter键**：触发链接跳转或按钮点击
3. **方向键**：在导航内移动
4. **Escape键**：关闭弹出菜单（如果有）

## 相关资源

- HTML模板：`index.html` (第14-31行)
- 样式文件：`src/styles/main.css` (第72-166行)
- 导航逻辑：`src/components/navbar.js`
- 主题切换：`src/components/theme-switcher.js`
- 鼠标光效：`src/components/mouse-glow.js`
- 滚动监听：`src/utils/scroll-observer.js`
- 主题配置：`config/themes.json`

---

## 设计变更日志

| 日期 | 版本 | 变更内容 |
|------|------|----------|
| 2026-05-23 | 1.0 | 初始版本，包含基础导航栏 |
| 2026-05-23 | 1.1 | 添加毛玻璃滚动增强效果 |
| 2026-05-23 | 1.2 | 实现滚动高亮逻辑 |
| 2026-05-23 | 1.3 | 添加鼠标跟随光效 |
| 2026-05-23 | 1.4 | 集成主题切换功能 |
| 2026-05-23 | 1.5 | 完善滚动入场动画和视差效果 |
