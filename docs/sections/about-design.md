# About 区域设计文档

## 区域概述

About区域是展示个人形象和背景的核心区域，通过精心设计的布局和动效，立体呈现开发者的专业能力、工作经历和教育背景。区域采用左右分栏布局，左侧聚焦个人形象，右侧展示详细信息。

## 设计目标

1. **形象塑造**：通过头像和视觉元素建立信任感
2. **能力展示**：直观展示技术栈和熟练程度
3. **经历呈现**：时间线形式清晰展示职业历程
4. **情感共鸣**：通过设计细节传达专业态度

## 视觉布局

### 页面结构

```
┌─────────────────────────────────────────────────────────┐
│  关于我                                                  │
│  ════════════════════════════════════════════            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ┌────────────┐    ┌──────────────────────────────┐   │
│   │            │    │                              │   │
│   │  头像区域   │    │  信息卡片 (毛玻璃)            │   │
│   │            │    │  ┌────────────────────────┐ │   │
│   │  [旋转光环] │    │  │ 张三                  │ │   │
│   │            │    │  │ 全栈开发工程师         │ │   │
│   │            │    │  │ 5年开发经验...         │ │   │
│   │            │    │  │                        │ │   │
│   └────────────┘    │  │ [JavaScript] [Three] │ │   │
│                     │  │ [React] [Node.js]    │ │   │
│                     │  └────────────────────────┘ │   │
│                     │                              │   │
│                     │  工作经历卡片 (毛玻璃)         │   │
│                     │  ● 2023 - 至今 · XX科技     │   │
│                     │  ● 2020 - 2023 · YY互娱    │   │
│                     │                              │   │
│                     │  教育背景卡片 (毛玻璃)         │   │
│                     │  ● 2016 - 2020 · XX大学    │   │
│                     └──────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 尺寸规范

| 元素 | 桌面端 | 移动端 |
|------|--------|--------|
| 网格布局 | 280px 1fr | 1fr |
| 头像尺寸 | 220px × 220px | 160px × 160px |
| 卡片间距 | 24px | 16px |
| 内容区域宽度 | max 1200px | 100% |
| 卡片内边距 | 32px | 24px |

## 核心元素设计

### 1. 头像区域

**组件构成：**

头像区域由三层元素叠加组成，从内到外依次是：头像图片层、头像占位层和旋转光环层。

**视觉层次：**

```html
<div class="avatar-wrapper">
  <div class="avatar-ring"></div>
  <img src="" alt="头像" class="avatar-img" />
  <div class="avatar-placeholder">📷<br/>上传头像</div>
</div>
```

**设计规范：**

- 外层容器：220px × 220px
- 圆角：50%（正圆）
- 背景色：var(--color-glass)
- 边框：1px solid var(--color-glass-border)

**旋转光环效果：**

采用双层光环设计，增强视觉层次感。

```css
.avatar-ring {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: var(--color-accent);
  animation: spin 8s linear infinite;
}

.avatar-ring::before {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 2px solid transparent;
  border-right-color: var(--color-accent2);
  animation: spin 6s linear infinite reverse;
}
```

**动画参数：**

| 层级 | 旋转方向 | 旋转周期 | 边框颜色 |
|------|----------|----------|----------|
| 外环 | 顺时针 | 8秒 | var(--color-accent) |
| 内环 | 逆时针 | 6秒 | var(--color-accent2) |

**视差效果：**

头像光环在滚动时会产生轻微的视差偏移，增强立体感：

```javascript
const offset = (centerY - viewportCenter) * 0.1;
el.style.transform = `translateY(${offset}px)`;
```

### 2. 信息卡片

**设计规范：**

- 背景色：var(--color-glass)
- 模糊度：var(--glass-blur)
- 饱和度：var(--glass-saturate)
- 边框：1px solid var(--color-glass-border)
- 圆角：20px
- 内边距：32px

**悬停效果：**

```css
.glass-card:hover {
  background: var(--color-glass-hover);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}
```

**信息层级：**

| 信息类型 | 字号 | 字重 | 颜色 | 间距 |
|----------|------|------|------|------|
| 姓名 | 1.6rem | 700 | var(--color-text) | 4px |
| 职位 | 0.95rem | 400 | var(--color-accent) | 12px |
| 个人简介 | 0.9rem | 400 | var(--color-text-secondary) | 20px |

### 3. 技能标签云

**布局方式：**

- Flex布局，自动换行
- 标签间距：10px
- 标签尺寸：自适应内容

**标签样式：**

```css
.skill-tag {
  padding: 6px 16px;
  background: rgba(233, 69, 96, 0.15);
  border: 1px solid rgba(233, 69, 96, 0.3);
  border-radius: 50px;
  font-size: 0.82rem;
  color: var(--color-accent);
}
```

**浮动动画：**

每个技能标签带有轻微的上下浮动动画，形成错落有致的视觉效果：

```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.skill-tag {
  animation: float 3s ease-in-out infinite;
  animation-delay: var(--delay, 0s);
}
```

**动画延迟：**

通过CSS变量动态设置延迟时间：

```javascript
profile.skills.map((s, i) =>
  `<span class="skill-tag" style="--delay:${(i * 0.15).toFixed(2)}s">${s.name}</span>`
)
```

**悬停效果：**

```css
.skill-tag:hover {
  background: rgba(233, 69, 96, 0.3);
  border-color: var(--color-accent);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(233, 69, 96, 0.3);
}
```

### 4. 时间轴组件

**设计规范：**

时间轴用于展示工作经历和教育背景，采用垂直布局和渐进式设计。

**视觉结构：**

```html
<div class="timeline">
  <div class="timeline-item">
    <div class="timeline-dot"></div>
    <div class="timeline-content">
      <span class="timeline-period">2023 - 至今</span>
      <strong>XX科技 · 高级前端工程师</strong>
      <p>负责核心产品前端架构设计</p>
    </div>
  </div>
</div>
```

**时间线轨道：**

```css
.timeline::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 4px;
  bottom: 4px;
  width: 2px;
  background: linear-gradient(to bottom, var(--color-accent), transparent);
}
```

**时间点样式：**

```css
.timeline-dot {
  position: absolute;
  left: -22px;
  top: 6px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 12px rgba(233, 69, 96, 0.5);
}
```

**时间线内容：**

| 元素 | 字号 | 字重 | 颜色 |
|------|------|------|------|
| 时间段 | 0.8rem | 400 | var(--color-accent) |
| 公司/学校+职位 | 0.95rem | 600 | var(--color-text) |
| 描述文字 | 0.85rem | 400 | var(--color-text-secondary) |

**间距规范：**

- 时间线左边距：20px
- 每个条目下间距：24px
- 内容与时间线间距：20px

### 5. 入场动画

**动画类型：**

区域采用多种入场动画，增加视觉层次：

| 元素 | 动画类型 | 方向 | 时长 |
|------|----------|------|------|
| 头像列 | reveal-left | 从左滑入 | 0.8s |
| 信息列 | reveal-right | 从右滑入 | 0.8s |
| 玻璃卡片 | reveal | 从下滑入 | 0.8s |

**动画实现：**

```css
.reveal-left {
  opacity: 0;
  transform: translateX(-40px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.reveal-left.visible {
  opacity: 1;
  transform: translateX(0);
}
```

**触发条件：**

- 阈值：0.15（元素15%可见时触发）
- 底部偏移：-40px
- 触发一次后自动解绑

```javascript
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
```

## 数据配置

### profile.json 结构

```json
{
  "name": "张三",
  "title": "全栈开发工程师",
  "avatar": "assets/avatar.jpg",
  "bio": "5年开发经验，热爱技术...",
  "email": "example@email.com",
  "github": "https://github.com",
  "skills": [
    { "name": "JavaScript", "level": 90 },
    { "name": "Three.js", "level": 85 }
  ],
  "experience": [
    {
      "company": "XX科技",
      "role": "高级前端工程师",
      "period": "2023 - 至今",
      "description": "负责核心产品前端架构设计"
    }
  ],
  "education": [
    {
      "school": "XX大学",
      "major": "计算机科学",
      "period": "2016 - 2020",
      "degree": "本科"
    }
  ]
}
```

## 响应式适配

### 桌面端 (≥900px)

采用左右分栏布局：

```css
.about-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
  align-items: start;
}
```

### 平板端 (640px - 900px)

保持左右布局，调整间距：

- 列间距：24px
- 头像尺寸：180px

### 移动端 (<640px)

切换为单列布局：

```css
@media (max-width: 900px) {
  .about-grid {
    grid-template-columns: 1fr;
  }

  .about-avatar-col {
    order: -1;  /* 头像置顶 */
  }
}
```

## 性能优化

1. **动画优化**：
   - 使用transform和opacity触发GPU加速
   - 入场动画仅触发一次
   - 视差动画使用requestAnimationFrame节流

2. **渲染优化**：
   - 头像占位使用CSS绘制，无需图片加载
   - 时间线使用语义化HTML，减少DOM节点

3. **懒加载策略**：
   - 头像图片延迟加载
   - 非视口内元素延迟渲染

## 无障碍设计

1. **图片替代文本**：
   - 头像使用 `alt="头像"`
   - 装饰性光环添加 `aria-hidden="true"`

2. **键盘导航**：
   - 技能标签支持Tab焦点
   - 焦点样式清晰可见

3. **屏幕阅读器**：
   - 时间线使用语义化结构
   - 重要信息使用标题层级

## 相关资源

- HTML模板：`index.html` (第54-124行)
- 样式文件：`src/styles/main.css` (第336-491行)
- 数据加载：`src/utils/loader.js`
- 渲染逻辑：`src/main.js` 中的 bindProfile 函数

---

## 设计变更日志

| 日期 | 版本 | 变更内容 |
|------|------|----------|
| 2026-05-23 | 1.0 | 初始版本，包含头像、信息卡片、时间线 |
| 2026-05-23 | 1.1 | 添加双层旋转光环效果 |
| 2026-05-23 | 1.2 | 增强技能标签悬浮动画 |
| 2026-05-23 | 1.3 | 优化入场动画和视差效果 |
