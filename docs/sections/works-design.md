# Works 区域设计文档

## 区域概述

Works区域是展示个人作品和项目经验的核心板块，承担着证明专业能力和展示创意实力的重要职责。区域通过精心设计的筛选系统和交互卡片，让访客能够快速浏览和发现感兴趣的项目。

## 设计目标

1. **作品展示**：以视觉吸引力强的方式展示项目成果
2. **快速定位**：通过分类筛选帮助访客快速找到目标内容
3. **深度探索**：通过卡片详情和交互引导深入了解项目
4. **视觉冲击**：通过动效和3D效果留下深刻印象

## 视觉布局

### 页面结构

```
┌─────────────────────────────────────────────────────────┐
│  作品展示                                                  │
│  ════════════════════════════════════════════            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   [全部] [开发] [设计] [3D]                               │
│   ════════════════════════════════                       │
│                                                         │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│   │             │  │             │  │             │    │
│   │  封面区域   │  │  封面区域   │  │  封面区域   │    │
│   │  (渐变背景) │  │  (渐变背景) │  │  (渐变背景) │    │
│   │             │  │             │  │             │    │
│   ├─────────────┤  ├─────────────┤  ├─────────────┤    │
│   │  项目标题   │  │  项目标题   │  │  项目标题   │    │
│   │  项目描述   │  │  项目描述   │  │  项目描述   │    │
│   │  [标签1][2] │  │  [标签1][2] │  │  [标签1][2] │    │
│   └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                         │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│   │             │  │             │  │             │    │
│   │  ...        │  │  ...        │  │  ...        │    │
│   └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 网格布局

**桌面端：**

```css
.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 28px;
}
```

- 自动填充列数
- 每列最小宽度：320px
- 卡片间距：28px

**平板端 (640px - 900px)：**

- 调整为两列布局
- 卡片最小宽度保持320px

**移动端 (<640px)：**

```css
@media (max-width: 640px) {
  .works-grid {
    grid-template-columns: 1fr;
  }
}
```

- 单列布局
- 卡片占满宽度

## 核心元素设计

### 1. 筛选栏

**布局方式：**

```html
<div class="filter-bar" id="filterBar">
  <button class="filter-btn active" data-filter="all">全部</button>
  <button class="filter-btn" data-filter="开发">开发</button>
  <button class="filter-btn" data-filter="设计">设计</button>
  <button class="filter-btn" data-filter="3D">3D</button>
</div>
```

**设计规范：**

| 状态 | 背景色 | 边框色 | 文字色 |
|------|--------|--------|--------|
| 默认 | var(--color-glass) | var(--color-glass-border) | var(--color-text-secondary) |
| 悬停 | var(--color-glass-hover) | rgba(255,255,255,0.2) | var(--color-text) |
| 激活 | rgba(233,69,96,0.2) | var(--color-accent) | var(--color-accent) |

**样式实现：**

```css
.filter-btn {
  padding: 8px 24px;
  border-radius: 50px;
  background: var(--color-glass);
  border: 1px solid var(--color-glass-border);
  color: var(--color-text-secondary);
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn.active {
  background: rgba(233, 69, 96, 0.2);
  border-color: var(--color-accent);
  color: var(--color-accent);
}
```

**交互行为：**

```javascript
btn.addEventListener('click', () => {
  filterBar.querySelectorAll('.filter-btn').forEach((b) =>
    b.classList.remove('active')
  );
  btn.classList.add('active');
  filterWorks(btn.dataset.filter);
});
```

### 2. 作品卡片

**整体结构：**

```html
<div class="work-card" data-category="开发">
  <div class="work-cover-placeholder">🖼️</div>
  <div class="work-info">
    <h3>智能数据看板</h3>
    <p>基于Vue3+Three.js的数据可视化平台...</p>
    <div class="work-tags">
      <span class="work-tag">Vue3</span>
      <span class="work-tag">Three.js</span>
      <span class="work-tag">WebSocket</span>
    </div>
  </div>
</div>
```

**尺寸规范：**

| 元素 | 桌面端 | 移动端 |
|------|--------|--------|
| 卡片宽度 | 100% (grid决定) | 100% |
| 封面高度 | 16:10 比例 | 保持比例 |
| 信息区内边距 | 20px | 16px |
| 卡片间距 | 28px | 20px |

**基础样式：**

```css
.work-card {
  background: var(--color-glass);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border: 1px solid var(--color-glass-border);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s;
  transform-style: preserve-3d;
  perspective: 1000px;
}
```

### 3. 封面占位区

**设计说明：**

在没有实际项目图片时，使用渐变背景作为占位符，保持视觉一致性。

**渐变配色：**

```css
.work-cover-placeholder {
  width: 100%;
  aspect-ratio: 16/10;
  background: linear-gradient(135deg, var(--color-accent2), var(--color-accent3));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.3);
}
```

**悬停效果：**

```css
.work-card:hover .work-cover {
  transform: scale(1.05);
}
```

### 4. 卡片信息区

**文字层级：**

| 元素 | 字号 | 字重 | 颜色 | 下间距 |
|------|------|------|------|--------|
| 项目标题 | 1.1rem | 600 | var(--color-text) | 6px |
| 项目描述 | 0.85rem | 400 | var(--color-text-secondary) | 12px |
| 标签 | 0.75rem | 400 | var(--color-text-secondary) | 0 |

**标签样式：**

```css
.work-tag {
  padding: 3px 10px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}
```

## 交互效果

### 1. 卡片入场动画

**动画序列：**

1. 卡片初始状态：透明度0，上移30px，缩放0.95
2. 延迟添加：每张卡片延迟 index × 0.1s
3. 动画过渡：0.6s ease-out
4. 最终状态：透明度1，位置归零，缩放1

**实现代码：**

```css
.work-card {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.work-card.card-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* 交错动画延迟 */
.work-card:nth-child(1) { transition-delay: 0s; }
.work-card:nth-child(2) { transition-delay: 0.1s; }
.work-card:nth-child(3) { transition-delay: 0.2s; }
.work-card:nth-child(4) { transition-delay: 0.3s; }
.work-card:nth-child(5) { transition-delay: 0.4s; }
.work-card:nth-child(6) { transition-delay: 0.5s; }
```

**触发时机：**

```javascript
setTimeout(() => {
  grid.querySelectorAll('.work-card').forEach((card, i) => {
    card.style.animationDelay = `${i * 0.1}s`;
    card.classList.add('card-visible');
  });
}, 100);
```

### 2. 筛选过渡动画

**动画流程：**

1. 点击筛选按钮
2. 所有卡片移除card-visible类（淡出）
3. 200ms后显示匹配卡片
4. 匹配卡片添加card-visible类（淡入）

**实现代码：**

```javascript
function filterWorks(category) {
  const cards = document.querySelectorAll('.work-card');
  cards.forEach((card) => {
    card.classList.remove('card-visible');
  });

  setTimeout(() => {
    cards.forEach((card) => {
      if (category === '全部' || card.dataset.category === category) {
        card.style.display = '';
        setTimeout(() => {
          card.classList.add('card-visible');
        }, 50);
      } else {
        card.style.display = 'none';
      }
    });
  }, 200);
}
```

### 3. 光泽扫过效果

**效果描述：**

鼠标悬停时，一道光泽从左向右扫过卡片，增强质感。

**实现代码：**

```css
.work-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.06),
    transparent
  );
  transition: left 0.6s;
  z-index: 1;
  pointer-events: none;
}

.work-card:hover::before {
  left: 150%;
}
```

### 4. 悬停阴影效果

**效果描述：**

鼠标悬停时，卡片轻微上浮并添加阴影，增强立体感。

**实现代码：**

```css
.work-card:hover {
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  transform: translateY(-4px);
}
```

### 5. 3D卡片倾斜效果

**效果描述：**

鼠标在卡片上移动时，卡片根据鼠标位置产生3D倾斜效果，模拟真实物体的观察视角变化。

**实现代码：**

```javascript
export function initCardTilt(card) {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 8;
    const rotateX = -((y - centerY) / centerY) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    card.style.transition = 'transform 0.5s ease-out';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease-out';
  });
}
```

**参数说明：**

| 参数 | 数值 | 说明 |
|------|------|------|
| 最大旋转角度 | ±8deg | X和Y轴的最大倾斜角度 |
| 透视距离 | 1000px | 3D透视的视距 |
| 离开过渡 | 0.5s | 恢复原状的动画时长 |
| 进入过渡 | 0.1s | 开始倾斜的动画时长 |

### 6. 点击跳转

**功能描述：**

点击卡片时，如果配置了链接，则在新标签页打开。

**实现代码：**

```javascript
grid.querySelectorAll('.work-card').forEach((card, i) => {
  card.addEventListener('click', () => {
    const link = items[i]?.link;
    if (link) window.open(link, '_blank');
  });
});
```

## 视差效果

### 实现方式

封面占位区域带有轻微的视差滚动效果：

```javascript
const parallaxElements = document.querySelectorAll('.work-cover-placeholder');
let ticking = false;

function updateParallax() {
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

## 数据配置

### works.json 结构

```json
{
  "categories": ["全部", "开发", "设计", "3D"],
  "items": [
    {
      "id": 1,
      "title": "智能数据看板",
      "description": "基于Vue3+Three.js的数据可视化平台，支持实时数据流展示。",
      "category": "开发",
      "cover": "",
      "tags": ["Vue3", "Three.js", "WebSocket"],
      "link": ""
    },
    {
      "id": 2,
      "title": "3D虚拟展厅",
      "description": "沉浸式线上美术馆，支持第一人称漫游与作品交互。",
      "category": "3D",
      "cover": "",
      "tags": ["Three.js", "GLSL", "Blender"],
      "link": ""
    }
  ]
}
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| categories | Array | 是 | 筛选分类列表，第一个为默认全选 |
| items | Array | 是 | 作品项目列表 |
| id | Number | 是 | 项目唯一标识 |
| title | String | 是 | 项目标题 |
| description | String | 是 | 项目简短描述 |
| category | String | 是 | 所属分类，需与categories匹配 |
| cover | String | 否 | 封面图片路径，空则使用占位背景 |
| tags | Array | 是 | 技术标签列表 |
| link | String | 否 | 项目链接，空则不可点击 |

## 响应式适配

### 桌面端 (≥900px)

- 三列或更多列网格
- 卡片最小宽度320px
- 完整动画效果

### 平板端 (640px - 900px)

- 两列网格
- 保持卡片最小宽度

### 移动端 (<640px)

- 单列布局
- 卡片全宽
- 简化部分动画（可选）

## 性能优化

1. **动画性能**：
   - 使用transform和opacity实现GPU加速
   - 入场动画仅触发一次
   - 筛选动画使用setTimeout控制时序

2. **渲染优化**：
   - 卡片DOM结构最小化
   - 渐变背景使用CSS绘制
   - 标签使用flex布局避免溢出

3. **事件优化**：
   - 卡片点击事件委托到grid容器
   - 滚动事件使用requestAnimationFrame节流

## 无障碍设计

1. **键盘导航**：
   - 筛选按钮可Tab访问
   - 卡片可聚焦（添加tabindex）
   - 回车键可触发点击

2. **屏幕阅读器**：
   - 卡片添加语义化结构
   - 分类信息使用aria-label
   - 隐藏装饰性元素

3. **减少动画**：
   - 尊重prefers-reduced-motion
   - 提供简化动画选项

## 相关资源

- HTML模板：`index.html` (第127-142行)
- 样式文件：`src/styles/main.css` (第493-627行)
- 渲染脚本：`src/sections/works.js`
- 3D效果：`src/components/card-tilt.js`
- 数据配置：`config/works.json`

---

## 设计变更日志

| 日期 | 版本 | 变更内容 |
|------|------|----------|
| 2026-05-23 | 1.0 | 初始版本，基础卡片展示和筛选功能 |
| 2026-05-23 | 1.1 | 添加入场动画和交错延迟效果 |
| 2026-05-23 | 1.2 | 实现3D卡片倾斜效果 |
| 2026-05-23 | 1.3 | 优化筛选过渡动画，增加平滑效果 |
| 2026-05-23 | 1.4 | 添加光泽扫过和视差效果 |
