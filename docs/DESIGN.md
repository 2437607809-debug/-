# 个人作品集网站设计文档

## 项目概述

这是一个创意开发者的个人展示网站，融合了现代Web技术和精致的设计美学。网站采用深色主题，结合毛玻璃效果、粒子动画和流畅的交互体验，展现开发者的专业能力和创意思维。

## 设计理念

### 核心原则

1. **沉浸式体验**：通过动态背景和交互反馈，创造引人入胜的浏览体验
2. **内容优先**：设计服务于内容，确保信息清晰传达
3. **性能与美观平衡**：在视觉效果和性能之间找到最佳平衡点
4. **响应式设计**：适配各种设备和屏幕尺寸

### 设计风格

- **主风格**：Glassmorphism（毛玻璃拟态）+ Dark Mode
- **视觉语言**：科技感、艺术感、数字未来主义
- **交互哲学**：流畅、自然、响应即时

## 技术架构

### 前端框架

- **构建工具**：Vite
- **主要语言**：Vanilla JavaScript (ES6+)
- **样式方案**：CSS3 (Variables, Grid, Flexbox, Animations)
- **3D渲染**：Three.js

### 项目结构

```
personal-website/
├── config/                 # JSON 配置文件
│   ├── profile.json       # 个人资料数据
│   ├── works.json         # 作品展示数据
│   ├── themes.json        # 背景主题配置
│   └── site.json          # 网站基础信息
├── public/
│   └── favicon.svg        # 网站图标
├── src/
│   ├── components/        # 功能组件
│   │   ├── navbar.js
│   │   ├── theme-switcher.js
│   │   ├── typewriter.js
│   │   ├── card-tilt.js
│   │   ├── mouse-glow.js
│   │   └── particle-bg.js
│   ├── sections/
│   │   └── works.js
│   ├── utils/
│   │   ├── loader.js
│   │   ├── media-adapter.js
│   │   └── scroll-observer.js
│   ├── styles/
│   │   └── main.css
│   └── main.js
└── index.html
```

## 色彩系统

### 基础色板

```css
:root {
  /* 背景色 */
  --color-bg: #050510;           /* 深紫黑色主背景 */

  /* 表面色 */
  --color-surface: rgba(255, 255, 255, 0.04);
  --color-glass: rgba(255, 255, 255, 0.06);
  --color-glass-border: rgba(255, 255, 255, 0.1);
  --color-glass-hover: rgba(255, 255, 255, 0.1);

  /* 文字色 */
  --color-text: #ffffff;
  --color-text-secondary: rgba(255, 255, 255, 0.65);

  /* 强调色 */
  --color-accent: #e94560;       /* 玫红色 - 主强调 */
  --color-accent2: #0f3460;      /* 深蓝色 - 次强调 */
  --color-accent3: #1a1a2e;     /* 深紫色 - 辅助 */
}
```

### 主题色彩变体

| 主题名称 | 主色 | 辅色 | 背景色 |
|---------|------|------|--------|
| Fluid (默认) | #e94560 | #0f3460 | #050510 |
| Cosmos | #4a4ae8 | #1a1a4e | #0a0a1a |
| Ocean | #00b4d8 | #0077b6 | #0a1a2a |

### 语义色彩

- **成功色**：#00ff88
- **警告色**：#ffaa00
- **错误色**：#ff4466
- **信息色**：#4488ff

## 字体系统

### 字体族

```css
--font-sans: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', sans-serif;
--font-mono: 'SF Mono', 'Fira Code', 'Consolas', monospace;
```

### 字体层级

| 元素 | 字号范围 | 字重 | 行高 |
|------|---------|------|------|
| Hero标题 | 2.8rem - 5rem | 800 | 1.1 |
| 副标题 | 1.2rem - 1.8rem | 600 | 1.4 |
| 章节标题 | 2rem - 2.8rem | 700 | 1.2 |
| 正文 | 0.9rem - 1rem | 400 | 1.6 |
| 小字 | 0.75rem - 0.85rem | 400 | 1.5 |

## 间距系统

### 基础单位

```css
--space-unit: 8px;
```

### 间距规范

| 名称 | 数值 | 用途 |
|------|------|------|
| xs | 4px | 紧凑间距 |
| sm | 8px | 小间距 |
| md | 16px | 中等间距 |
| lg | 24px | 大间距 |
| xl | 32px | 特大间距 |
| 2xl | 48px | 区块间距 |
| 3xl | 64px | 区域间距 |

### 容器宽度

```css
--container-width: 1200px;
--nav-height: 64px;
--section-padding: 120px 0;
```

## 毛玻璃系统

### 玻璃效果参数

```css
--glass-blur: 20px;
--glass-saturate: 1.8;
```

### 玻璃组件层级

1. **基础层**：`background: rgba(255, 255, 255, 0.04)`
2. **标准层**：`background: rgba(255, 255, 255, 0.06)`
3. **悬停层**：`background: rgba(255, 255, 255, 0.1)`
4. **边框**：`border: 1px solid rgba(255, 255, 255, 0.1)`

## 动效系统

### 动画时长规范

| 类型 | 时长 | 用途 |
|------|------|------|
| 瞬时 | 0.1s | 微交互 |
| 快速 | 0.2s | 状态切换 |
| 正常 | 0.3s | 常规过渡 |
| 缓慢 | 0.5s | 入场动画 |
| 极慢 | 0.8s | 强调动画 |

### 缓动函数

```css
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### 主要动画类型

1. **入场动画**：淡入 + 上浮 (0.8s)
2. **悬停动画**：缩放 + 阴影
3. **过渡动画**：平滑状态切换
4. **粒子动画**：持续循环
5. **打字机动画**：逐字显示

## 响应式断点

```css
/* 移动端优先 */
/* 小型设备 */
@media (max-width: 640px) { }

/* 中型设备 */
@media (max-width: 900px) { }

/* 大型设备 */
@media (max-width: 1200px) { }

/* 超大屏幕 */
@media (min-width: 1400px) { }
```

## 可访问性规范

### 颜色对比度

- 重要文字：对比度 ≥ 4.5:1
- 大字/标题：对比度 ≥ 3:1
- 装饰性元素：无对比度要求

### 交互反馈

- 所有可点击元素有明显的悬停和聚焦状态
- 按钮有禁用状态样式
- 键盘可完全导航
- 焦点元素有明显的轮廓指示

## 性能优化策略

1. **图片优化**：使用WebP格式，提供渐进式加载
2. **动画优化**：
   - 使用 `transform` 和 `opacity` 触发GPU加速
   - 使用 `will-change` 提示浏览器优化
   - 节流和防抖处理高频事件
3. **代码分割**：按需加载非关键模块
4. **缓存策略**：利用浏览器缓存静态资源

## 开发规范

### 代码风格

- 使用 ES6+ 模块化开发
- CSS使用BEM命名规范
- 所有颜色值使用CSS变量
- 动画使用CSS动画和requestAnimationFrame

### Git提交规范

```
feat: 新功能
fix: 问题修复
docs: 文档更新
style: 代码格式调整
refactor: 重构
perf: 性能优化
```

---

## 相关文档

- [Hero 区域设计文档](./sections/hero-design.md)
- [About 区域设计文档](./sections/about-design.md)
- [Works 区域设计文档](./sections/works-design.md)
- [Contact 区域设计文档](./sections/contact-design.md)
- [导航与交互设计文档](./sections/navigation-design.md)
