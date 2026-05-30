# Hero 区域设计文档

## 区域概述

Hero区域是网站的入口页面，承担着第一印象的塑造和用户引导的核心职责。通过精心设计的视觉效果和交互体验，快速传达开发者的专业形象和个人品牌。

## 设计目标

1. **即时吸引**：在0.5秒内抓住访客注意力
2. **信息传达**：清晰展示开发者身份和专业领域
3. **情感连接**：通过动效传达创意和技术实力
4. **行为引导**：引导用户向下探索或采取行动

## 视觉布局

### 页面结构

```
┌─────────────────────────────────────┐
│  [固定导航栏 - 毛玻璃效果]           │
├─────────────────────────────────────┤
│                                     │
│         Three.js 粒子背景             │
│      (全屏动态粒子波浪动画)           │
│                                     │
│      ┌─────────────────────┐       │
│      │                     │       │
│      │   渐变标题动画       │       │
│      │  "Hi, I'm XXX"      │       │
│      │   [呼吸光标]        │       │
│      │                     │       │
│      │   副标题区域         │       │
│      │  创意开发者 / 全栈  │       │
│      │                     │       │
│      │   描述文字           │       │
│      │                     │       │
│      │  [查看作品] [联系我] │       │
│      │                     │       │
│      └─────────────────────┘       │
│                                     │
│            ↓ 向下滚动               │
│         [滚动指示器]                │
│                                     │
└─────────────────────────────────────┘
```

### 尺寸规范

| 元素 | 桌面端 | 移动端 |
|------|--------|--------|
| 内容最大宽度 | 700px | 100% |
| 标题字号 | clamp(2.8rem, 7vw, 5rem) | clamp(2.2rem, 8vw, 4rem) |
| 副标题字号 | clamp(1.2rem, 2.5vw, 1.8rem) | clamp(1rem, 3vw, 1.5rem) |
| 按钮间距 | 16px | 12px |
| 内容距顶部 | 50vh (居中) | 40vh |

## 核心元素设计

### 1. 动态标题

**设计规范：**

- 字号：clamp(2.8rem, 7vw, 5rem)
- 字重：800
- 行高：1.1
- 字间距：-0.02em
- 文字渐变：白 → 玫红 → 深蓝

**渐变动画：**

```css
.hero-title {
  background: linear-gradient(135deg, #ffffff 0%, #e94560 50%, #0f3460 100%);
  background-size: 200% 200%;
  animation: gradientShift 8s ease infinite;
}
```

**动画参数：**

- 动画时长：8秒
- 缓动函数：ease
- 动画类型：无限循环
- 背景位置：从左到右平滑过渡

### 2. 打字机效果

**功能描述：**

文字逐字显示，模拟真实打字体验，配合自然停顿增强节奏感。

**打字节奏：**

| 字符类型 | 延迟系数 | 示例 |
|----------|----------|------|
| 普通字符 | 1.0x | "H", "e", "l", "l", "o" |
| 空格 | 0.3x | " " |
| 短横线 | 0.3x | "-" |
| 句号 | 3.0x | "." |
| 逗号 | 3.0x | "," |
| 感叹号 | 3.0x | "!" |
| 问号 | 3.0x | "?" |

**代码实现：**

```javascript
function type() {
  if (index < text.length) {
    const char = text.charAt(index);
    el.textContent += char;
    index++;

    let delay = getRandomDelay();

    if (char === ' ' || char === '-') {
      delay = speed * 0.3;
    } else if (['.', ',', '!', '?', ':'].includes(char)) {
      delay = speed * 3;
    }

    setTimeout(type, delay);
  }
}
```

**随机性增强：**

基础延迟 = 80ms
实际延迟 = 基础延迟 + (Math.random() - 0.5) × 40ms
范围：60ms - 100ms

### 3. 呼吸光标

**设计规范：**

- 宽度：3px
- 高度：1em（与文字同高）
- 背景色：var(--color-accent)
- 垂直对齐：middle

**动画组合：**

```css
.cursor {
  animation: cursorBlink 1s ease-in-out infinite,
             cursorBreathe 2s ease-in-out infinite;
}
```

**动画详解：**

1. **闪烁动画** (cursorBlink)
   - 时长：1秒
   - 缓动：ease-in-out
   - 效果：透明度在0.3到1之间循环

2. **呼吸动画** (cursorBreathe)
   - 时长：2秒
   - 缓动：ease-in-out
   - 效果：
     - scaleY: 1 → 1.1 → 1
     - box-shadow: 8px → 16px → 8px
     - 模拟真实光标闪烁的呼吸感

### 4. 副标题区域

**设计规范：**

- 字号：clamp(1.2rem, 2.5vw, 1.8rem)
- 字重：600
- 颜色：var(--color-accent)
- 字间距：0.05em
- 装饰线长度：40px × 2

**装饰元素：**

使用CSS伪元素创建水平装饰线：

```css
.hero-subtitle::before,
.hero-subtitle::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-accent));
}
```

### 5. 行动按钮组

**布局方式：**

- 水平排列，flex-wrap: wrap
- 按钮间距：16px
- 移动端垂直堆叠

**按钮样式对比：**

| 样式 | 主按钮 | 次按钮 |
|------|--------|--------|
| 类型 | 实心按钮 | 轮廓按钮 |
| 背景色 | var(--color-accent) | transparent |
| 边框 | none | 1px solid rgba(255,255,255,0.3) |
| 阴影 | 0 4px 24px rgba(233,69,96,0.35) | none |
| 悬停上浮 | -3px | -3px |

**涟漪效果：**

按钮添加圆形涟漪扩散效果：

```css
.btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn:hover::before {
  width: 300px;
  height: 300px;
}
```

### 6. 滚动指示器

**位置：** 页面底部居中，距底部40px

**组成元素：**

1. **提示文字**
   - 字号：0.75rem
   - 字间距：0.1em
   - 颜色：var(--color-text-secondary)
   - 大写转换

2. **滚动线条**
   - 宽度：1px
   - 高度：40px
   - 渐变：从accent到透明
   - 动画：缩放 + 透明度循环

**入场动画：**

```css
.scroll-indicator {
  animation: fadeInUp 1.5s ease-out 0.5s both;
}
```

## 交互体验

### 鼠标跟随光效

**功能描述：**

鼠标移动时，页面产生两个柔和的光晕跟随鼠标，增强沉浸感。

**光效参数：**

| 参数 | 主光晕 | 次光晕 |
|------|--------|--------|
| 尺寸 | 400px | 300px |
| 颜色 | rgba(233,69,96,0.15) | rgba(15,52,96,0.2) |
| 混合模式 | screen | screen |
| 平滑系数 | 0.08 | 0.05 |

**代码实现：**

```javascript
function animate() {
  glowX += (mouseX - glowX) * smoothing;
  glowY += (mouseY - glowY) * smoothing;

  glow.style.left = glowX + 'px';
  glow.style.top = glowY + 'px';

  requestAnimationFrame(animate);
}
```

**交互状态：**

- 鼠标进入：光效淡入显示
- 鼠标移动：光效平滑跟随
- 鼠标离开：光效淡出隐藏

## Three.js 粒子背景

### 技术规格

| 参数 | 数值 |
|------|------|
| 粒子数量 | 6000 |
| 粒子尺寸 | 1-3px |
| 相机视野 | 75° |
| 相机距离 | 1000 |
| 渲染模式 | AdditiveBlending |

### 动画效果

**波浪动画：**

```javascript
positions[i3 + 1] = y + Math.sin(time + x * 0.01) * 0.5;
positions[i3] = x + Math.cos(time + y * 0.01) * 0.3;
```

**鼠标交互：**

```javascript
camera.position.x += (mouseX - camera.position.x) * 0.02;
camera.position.y += (-mouseY - camera.position.y) * 0.02;
```

### 主题切换

支持三种预设主题的实时切换：

1. **Fluid** - 玫红 + 深蓝，适合通用场景
2. **Cosmos** - 紫色系，适合创意展示
3. **Ocean** - 青蓝系，适合海洋/环保主题

## 响应式适配

### 桌面端 (≥900px)

- 内容居中显示
- 按钮水平排列
- 粒子数量：6000
- 光效全开

### 平板端 (640px - 900px)

- 保持内容居中
- 按钮保持水平
- 粒子数量：4000
- 光效减弱

### 移动端 (<640px)

- 内容靠上显示
- 按钮垂直堆叠
- 粒子数量：3000
- 光效关闭（提升性能）
- 标题渐变动画减弱

## 性能优化

1. **动画节流**：使用requestAnimationFrame
2. **硬件加速**：transform和opacity使用GPU
3. **条件加载**：移动端减少粒子数量
4. **懒加载**：非首屏元素延迟加载
5. **像素比限制**：最大2x，减少渲染压力

## 无障碍设计

1. **焦点管理**：键盘可访问所有交互元素
2. **减少动画**：尊重用户减少动画偏好
3. **颜色对比**：文字与背景对比度≥4.5:1
4. **屏幕阅读器**：重要文本有语义化标签

## 相关资源

- 入口文件：`index.html` (第34-51行)
- 样式文件：`src/styles/main.css` (第196-340行)
- 交互脚本：
  - `src/components/typewriter.js`
  - `src/components/mouse-glow.js`
  - `src/components/particle-bg.js`
  - `src/main.js`

---

## 设计变更日志

| 日期 | 版本 | 变更内容 |
|------|------|----------|
| 2026-05-23 | 1.0 | 初始版本，集成粒子背景和鼠标光效 |
| 2026-05-23 | 1.1 | 优化打字机节奏和光标动画 |
| 2026-05-23 | 1.2 | 添加渐变标题动画和按钮涟漪效果 |
