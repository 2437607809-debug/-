import './styles/main.css';
import { initScene, startLoop, setRenderFn } from './three/scene.js';
import { initFluidBackground, switchFluidTheme, setFluidOpacity, disposeFluidBackground } from './three/backgrounds/fluid.js';
import { initImageBackground, switchToImageBg, switchToShaderBg, disposeImageBackground } from './three/backgrounds/imagebg.js';
import { initAmbientParticles, switchParticleTheme, disposeAmbientParticles } from './three/particles/ambient.js';
import { initPostProcessing, render, setBloomStrength } from './three/postprocessing.js';
import { initFloatingObjects, switchFloatingTheme, disposeFloatingObjects } from './three/objects/floating.js';
import { initHero3D, switchHeroTheme, disposeHero3D } from './three/objects/hero3d.js';
import { initNavigation } from './components/navbar.js';
import { initTypewriter } from './components/typewriter.js';
import { initScrollObserver } from './utils/scroll-observer.js';
import { initMouseGlow } from './components/mouse-glow.js';
import { initAudioPlayer } from './components/audio-player.js';
import { loadJSON } from './utils/loader.js';
import { renderWorks } from './sections/works.js';
import { adaptMedia } from './utils/media-adapter.js';
import {
  getProfile, getWorks, getContact, getSite, getTheme,
  getAvatar, getQRCode, getAllWorkCovers
} from './utils/storage.js';

// ===== 设备检测 =====
const isMobile = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent)
  || window.innerWidth < 768
  || (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4);
const isLowPower = navigator.deviceMemory && navigator.deviceMemory < 4;

// ===== Loading 进度 =====
const loaderEl = document.getElementById('loader');
const loaderProgress = document.getElementById('loaderProgress');
const loaderText = document.getElementById('loaderText');

function updateProgress(percent, step) {
  if (loaderProgress) loaderProgress.textContent = `${Math.round(percent)}%`;
  if (step && loaderText) loaderText.textContent = step;
}

function hideLoader() {
  if (!loaderEl) return;
  updateProgress(100, 'READY');
  // 短暂延迟让 100% 显示出来再隐藏
  setTimeout(() => {
    loaderEl.classList.add('hidden');
  }, 350);
}

// ===== 应用初始化 =====
document.addEventListener('DOMContentLoaded', async () => {
  updateProgress(5, 'LOADING DATA');

  // 0. 加载数据（localStorage 优先，JSON 兜底）
  const data = await loadAllData();

  // 0.1 绑定网站 meta
  bindSiteMeta(data.site);

  updateProgress(15, 'INIT SCENE');

  // 1. 初始化 Three.js 场景
  const canvas = document.getElementById('webgl');
  if (canvas) {
    initScene(canvas);

    updateProgress(25, 'SHADERS');

    // 2. 流体 Shader 背景
    initFluidBackground();

    updateProgress(40, 'TEXTURES');

    // 2.5 图片背景（1.png → Ken Burns动态效果）
    initImageBackground('/assets/backgrounds/dynamic-bg.png');

    updateProgress(55, 'PARTICLES');

    // 3. 环境粒子（场景内部自动适配性能等级）
    initAmbientParticles();

    updateProgress(65, 'OBJECTS');

    // 3.5 漂浮 3D 几何体
    initFloatingObjects();
    // 3.8 Hero 粒子环
    initHero3D();

    updateProgress(75, 'POST FX');

    // 4. 后处理（Bloom）- 移动端/低配关闭
    if (!isMobile && !isLowPower) {
      initPostProcessing();
      setRenderFn(render);
    }

    // 5. 应用已保存的主题（初始无动画）
    const savedTheme = data.theme || 'fluid';
    if (savedTheme === 'image') {
      setFluidOpacity(0);
      switchToImageBg(false);
    } else {
      switchFluidTheme(savedTheme);
      switchParticleTheme(savedTheme);
      switchFloatingTheme(savedTheme);
      switchHeroTheme(savedTheme);
    }

    // 6. 启动渲染循环
    startLoop();
  }

  updateProgress(85, 'UI SETUP');

  // 7. 鼠标跟随光效（移动端关闭）
  if (!isMobile) {
    initMouseGlow();
  }

  // 7.5 背景音乐播放器
  initAudioPlayer();

  // 8. 导航滚动高亮
  initNavigation();

  // 8.5 可访问性增强
  enhanceAccessibility();

  // 9. 打字机效果
  const heroText = data.site?.heroText || "Hi, I'm XXX";
  initTypewriter('typingText', heroText, 80);

  // 10. Hero 副标题
  if (data.site?.subtitle) {
    const el = document.querySelector('.hero-subtitle');
    if (el) el.textContent = data.site.subtitle;
  }
  if (data.site?.heroDesc) {
    const el = document.querySelector('.hero-desc');
    if (el) el.textContent = data.site.heroDesc;
  }

  // 11. 滚动入场动画
  initScrollObserver();

  // 12. 背景主题切换
  initThemeSwitcher();

  // 13. 回到顶部
  document.getElementById('backToTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 14. 绑定内容到 DOM
  bindAllContent(data);

  // 14.5 联系表单
  initContactForm();

  // 15. 隐藏 Loading
  hideLoader();
});

// ===== 联系表单 =====
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('submitBtn');
  const successEl = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
      name: form.querySelector('#formName')?.value?.trim() || '',
      email: form.querySelector('#formEmail')?.value?.trim() || '',
      message: form.querySelector('#formMessage')?.value?.trim() || '',
      timestamp: new Date().toISOString()
    };

    if (!formData.name || !formData.email || !formData.message) {
      if (successEl) {
        successEl.textContent = '请填写所有字段';
        successEl.style.color = '#ff6b6b';
        successEl.classList.add('show');
        setTimeout(() => successEl.classList.remove('show'), 3000);
      }
      return;
    }

    // 保存到 localStorage（admin 可查看）
    try {
      const existing = JSON.parse(localStorage.getItem('pw_messages') || '[]');
      existing.push(formData);
      localStorage.setItem('pw_messages', JSON.stringify(existing));
    } catch { /* ignore */ }

    // 反馈
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '已发送!';
    }
    if (successEl) {
      successEl.textContent = '消息已发送，感谢联系！';
      successEl.style.color = '#22c55e';
      successEl.classList.add('show');
    }

    // 重置
    form.reset();
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '发送消息';
      }
      if (successEl) successEl.classList.remove('show');
    }, 3000);
  });
}

// ===== 数据加载（localStorage > JSON） =====
async function loadAllData() {
  // 并行加载 JSON 默认值
  const [defaultProfile, defaultWorks, defaultContact, defaultSite] = await Promise.all([
    loadJSON('/config/profile.json').catch(() => null),
    loadJSON('/config/works.json').catch(() => null),
    loadJSON('/config/contact.json').catch(() => null),
    loadJSON('/config/site.json').catch(() => null)
  ]);

  return {
    profile: getProfile() || defaultProfile,
    works: getWorks() || defaultWorks,
    contact: getContact() || defaultContact,
    site: getSite() || defaultSite,
    theme: getTheme(),
    avatar: getAvatar(),
    qrcode: getQRCode(),
    workCovers: getAllWorkCovers()
  };
}

// ===== 绑定所有内容到 DOM =====
function bindAllContent(data) {
  // 个人资料
  if (data.profile) {
    bindProfile(data.profile);
    bindContactLinks(data.profile);
    loadAvatarImg(data.avatar);
  }

  // 作品集
  if (data.works) {
    renderWorks(data.works.items, data.works.categories, data.workCovers);
  }

  // 联系方式
  if (data.contact) {
    bindContactLinks(data.contact);
    loadQRCodeImg(data.qrcode || data.contact.wechat_qrcode);
  }
}

// ===== 网站 Meta =====
function bindSiteMeta(site) {
  if (!site) return;
  if (site.title) document.title = site.title;
  if (site.description) {
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = site.description;
  }
}

// ===== 个人资料 =====
function bindProfile(profile) {
  if (profile.name) {
    const el = document.getElementById('infoName');
    if (el) el.textContent = profile.name;
  }
  if (profile.title) {
    const el = document.getElementById('infoTitle');
    if (el) el.textContent = profile.title;
  }
  if (profile.bio) {
    const el = document.getElementById('infoBio');
    if (el) el.textContent = profile.bio;
  }

  if (profile.skills) {
    const container = document.getElementById('skillsCloud');
    if (container) {
      container.innerHTML = profile.skills
        .map((s, i) => `
          <div class="skill-item" style="--delay:${(i * 0.15).toFixed(2)}s">
            <div class="skill-header">
              <span class="skill-name">${s.name}</span>
              <span class="skill-level">${s.level}%</span>
            </div>
            <div class="skill-bar">
              <div class="skill-fill" style="width:${s.level}%"></div>
            </div>
          </div>`)
        .join('');
    }
  }

  if (profile.experience) {
    const container = document.getElementById('timelineExp');
    if (container) {
      container.innerHTML = profile.experience
        .map(exp => `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <span class="timeline-period">${exp.period}</span>
            <strong>${exp.company} · ${exp.role}</strong>
            <p>${exp.description || ''}</p>
          </div>
        </div>`)
        .join('');
    }
  }

  if (profile.education) {
    const container = document.getElementById('timelineEdu');
    if (container) {
      container.innerHTML = profile.education
        .map(edu => `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <span class="timeline-period">${edu.period}</span>
            <strong>${edu.school} · ${edu.major}</strong>
            <p>${edu.degree || ''}</p>
          </div>
        </div>`)
        .join('');
    }
  }
}

function bindContactLinks(data) {
  if (data.email) {
    const el = document.getElementById('contactEmail');
    if (el) {
      el.href = `mailto:${data.email}`;
      el.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>${data.email}`;
    }
  }
  if (data.github) {
    const el = document.getElementById('contactGithub');
    if (el) el.href = data.github;
  }
}

// ===== 图片加载 =====
function loadAvatarImg(avatarSrc) {
  const img = document.getElementById('avatarImg');
  const placeholder = document.getElementById('avatarPlaceholder');
  if (!img) return;

  const src = avatarSrc || '';
  if (!src) return;

  const testImg = new Image();
  testImg.onload = () => {
    img.src = src;
    img.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';
    adaptMedia(img);
  };
  testImg.onerror = () => { /* 保留占位符 */ };
  testImg.src = src;
}

function loadQRCodeImg(qrSrc) {
  const img = document.getElementById('qrcodeImg');
  const placeholder = document.getElementById('qrcodePlaceholder');
  if (!img) return;

  const src = qrSrc || '';
  if (!src) return;

  const testImg = new Image();
  testImg.onload = () => {
    img.src = src;
    img.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';
  };
  testImg.onerror = () => { /* 保留占位符 */ };
  testImg.src = src;
}

// ===== 可访问性增强 =====
function enhanceAccessibility() {
  // 导航链接 ARIA
  document.querySelectorAll('.nav-link').forEach(link => {
    link.setAttribute('role', 'menuitem');
  });

  // 主题切换按钮
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.setAttribute('aria-label', '切换背景主题（流体 / 深空 / 海浪 / 图片）');
    themeBtn.setAttribute('role', 'button');
    themeBtn.setAttribute('tabindex', '0');
    themeBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        themeBtn.click();
      }
    });
  }

  // 导航栏容器 ARIA
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    navbar.setAttribute('role', 'navigation');
    navbar.setAttribute('aria-label', '主导航');
  }
}

// ===== 主题切换 =====
function initThemeSwitcher() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const themes = ['fluid', 'cosmos', 'ocean', 'image'];
  const themeLabels = ['流体渐变', '深空星波', '海浪涌动', '图片背景'];
  let idx = 0;

  // 从 localStorage 恢复当前索引
  const saved = localStorage.getItem('portfolio_theme');
  if (saved) {
    const found = themes.indexOf(saved);
    if (found !== -1) idx = found;
  }

  // 设置初始 aria-label
  btn.setAttribute('aria-label', `当前背景: ${themeLabels[idx]}`);

  btn.addEventListener('click', () => {
    idx = (idx + 1) % themes.length;
    btn.setAttribute('aria-label', `当前背景: ${themeLabels[idx]}`);
    applyTheme(themes[idx], true);
  });
}

function applyTheme(theme, animate = true) {
  const isImage = theme === 'image';

  if (isImage) {
    // 切换到图片背景：着色器渐隐，图片渐显
    setFluidOpacity(0);           // 流体着色器 → 透明
    switchToImageBg(animate);     // 图片背景 → 可见
  } else {
    // 切换到着色器背景：图片渐隐，着色器渐显
    switchToShaderBg();           // 图片背景 → 透明
    setFluidOpacity(1);           // 流体着色器 → 可见
    switchFluidTheme(theme);
    switchParticleTheme(theme);
    switchFloatingTheme(theme);
    switchHeroTheme(theme);
  }

  // 保存主题偏好
  try {
    localStorage.setItem('portfolio_theme', theme);
  } catch { /* ignore */ }
}
