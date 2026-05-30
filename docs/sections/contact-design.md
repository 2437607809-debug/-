# Contact 区域设计文档

## 区域概述

Contact区域是网站的用户转化核心区域，承担着引导访客采取行动、建立联系的重要职责。通过精心设计的联系卡片和社交链接，为访客提供多种便捷的联系方式，同时保持整体设计风格的一致性。

## 设计目标

1. **降低联系门槛**：提供直观、便捷的联系入口
2. **多渠道覆盖**：整合微信、邮箱、社交媒体等多渠道
3. **视觉引导**：通过设计元素引导用户采取行动
4. **品牌延续**：保持与整体网站风格的一致性

## 视觉布局

### 页面结构

```
┌─────────────────────────────────────────────────────────┐
│  联系方式                                                  │
│  ════════════════════════════════════════════            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│    ┌───────────────┐    ┌─────────────────────────┐     │
│    │               │    │                         │     │
│    │  二维码卡片   │    │  联系信息卡片 (毛玻璃)    │     │
│    │  (毛玻璃)     │    │                         │     │
│    │               │    │  更多联系方式            │     │
│    │  ┌─────────┐ │    │  ┌───────────────────┐ │     │
│    │  │ 二维码  │ │    │  │ 📧 example@...    │ │     │
│    │  │ 占位区  │ │    │  └───────────────────┘ │     │
│    │  └─────────┘ │    │  ┌───────────────────┐ │     │
│    │               │    │  │ 🐙 GitHub        │ │     │
│    │  扫码添加微信 │    │  └───────────────────┘ │     │
│    └───────────────┘    └─────────────────────────┘     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 网格布局

**桌面端：**

```css
.contact-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 40px;
  max-width: 700px;
  margin: 0 auto;
}
```

**平板端和移动端 (≤900px)：**

```css
@media (max-width: 900px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }

  .qrcode-card {
    max-width: 300px;
    margin: 0 auto;
  }
}
```

## 核心元素设计

### 1. 二维码卡片

**整体结构：**

```html
<div class="glass-card qrcode-card">
  <div class="qrcode-wrapper" id="qrcodeWrapper">
    <img src="" alt="微信二维码" class="qrcode-img" id="qrcodeImg" />
    <div class="qrcode-placeholder" id="qrcodePlaceholder">📱<br/>上传二维码</div>
  </div>
  <p class="qrcode-hint">扫码添加微信</p>
</div>
```

**设计规范：**

| 元素 | 尺寸 | 样式 |
|------|------|------|
| 卡片宽度 | 300px | max-width |
| 内边距 | 40px 32px | 上下40px，左右32px |
| 二维码容器 | 200px × 200px | 圆角16px |
| 提示文字 | 0.85rem | var(--color-text-secondary) |

**卡片样式：**

```css
.qrcode-card {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 32px;
}
```

**二维码容器：**

```css
.qrcode-wrapper {
  width: 200px;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.4s;
}
```

**悬停效果：**

```css
.qrcode-wrapper:hover {
  box-shadow: 0 0 32px rgba(233, 69, 96, 0.4);
  transform: scale(1.05);
}
```

**占位状态：**

当没有上传二维码时，显示占位提示：

```css
.qrcode-placeholder {
  font-size: 0.85rem;
  color: #999;
  text-align: center;
  line-height: 1.8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
```

### 2. 联系信息卡片

**整体结构：**

```html
<div class="contact-info">
  <div class="glass-card contact-card">
    <h4 class="card-subtitle">更多联系方式</h4>
    <div class="contact-links">
      <a href="mailto:example@email.com" class="contact-link" id="contactEmail">
        <svg width="18" height="18" viewBox="0 0 24 24">...</svg>
        example@email.com
      </a>
      <a href="https://github.com" class="contact-link" target="_blank" rel="noopener" id="contactGithub">
        <svg width="18" height="18" viewBox="0 0 24 24">...</svg>
        GitHub
      </a>
    </div>
  </div>
</div>
```

**卡片样式：**

```css
.contact-card {
  display: flex;
  flex-direction: column;
  gap: 0;
}
```

**子标题样式：**

```css
.card-subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-accent);
  margin-bottom: 20px;
  letter-spacing: 0.05em;
}
```

### 3. 联系链接按钮

**布局方式：**

```css
.contact-links {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
```

**链接按钮样式：**

```css
.contact-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  transition: all 0.3s;
}
```

**悬停效果：**

```css
.contact-link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-text);
  transform: translateX(4px);
}
```

**图标样式：**

- 尺寸：18px × 18px
- 描边宽度：2px
- 填充模式：部分填充，部分描边

### 4. 联系卡片玻璃效果

**统一的毛玻璃效果：**

```css
.glass-card {
  background: var(--color-glass);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border: 1px solid var(--color-glass-border);
  border-radius: 20px;
  padding: 32px;
  transition: all 0.4s;
}
```

**悬停统一效果：**

```css
.glass-card:hover {
  background: var(--color-glass-hover);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}
```

## 交互设计

### 1. 链接打开策略

| 链接类型 | 打开方式 | 属性配置 |
|----------|----------|----------|
| 邮箱 | 打开本地邮件客户端 | mailto:前缀 |
| GitHub | 新标签页打开 | target="_blank" |
| 其他社交媒体 | 新标签页打开 | target="_blank" + rel="noopener" |

**安全配置：**

```html
<a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
```

- `target="_blank"`：在新标签页打开
- `rel="noopener"`：防止新页面访问原页面的window对象

### 2. 动态内容绑定

**邮箱链接：**

```javascript
if (profile.email) {
  const el = document.getElementById('contactEmail');
  el.href = `mailto:${profile.email}`;
  el.innerHTML = `<svg>...</svg>${profile.email}`;
}
```

**GitHub链接：**

```javascript
if (profile.github) {
  const el = document.getElementById('contactGithub');
  el.href = profile.github;
}
```

### 3. 悬停微交互

**二维码容器：**

- 轻微放大：scale(1.05)
- 阴影增强：0 0 32px rgba(233,69,96,0.4)
- 过渡时长：0.4s

**联系链接：**

- 背景色加深
- 文字颜色变亮
- 水平位移：translateX(4px)
- 过渡时长：0.3s

## 数据配置

### profile.json 扩展字段

```json
{
  "email": "example@email.com",
  "github": "https://github.com/username",
  "wechat": "微信号或二维码图片路径"
}
```

### 二维码上传机制

当前版本使用占位符，后续可扩展为：

1. **静态配置**：在config中指定图片路径
2. **用户上传**：添加后台管理界面
3. **动态生成**：使用QRCode库生成

## 响应式适配

### 桌面端 (≥900px)

```
┌────────────┬────────────────────┐
│            │                    │
│   二维码    │    联系信息        │
│   300px    │      1fr          │
│            │                    │
└────────────┴────────────────────┘
```

### 平板端和移动端 (≤900px)

```
┌────────────────────┐
│                    │
│      二维码        │
│   max-width: 300px │
│                    │
├────────────────────┤
│                    │
│     联系信息       │
│                    │
└────────────────────┘
```

**样式调整：**

```css
@media (max-width: 900px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }

  .qrcode-card {
    max-width: 300px;
    margin: 0 auto;
  }
}
```

## 页脚集成

### 页脚结构

Contact区域下方是页脚区域，包含版权信息和返回顶部按钮：

```html
<footer class="footer">
  <div class="footer-inner">
    <p class="footer-copy">&copy; 2026 Portfolio. All Rights Reserved.</p>
    <div class="footer-links">
      <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
      <a href="mailto:example@email.com">Email</a>
    </div>
    <button class="back-to-top" id="backToTop" aria-label="回到顶部">
      <svg>...</svg>
    </button>
  </div>
</footer>
```

### 页脚样式

**布局：**

```css
.footer-inner {
  max-width: var(--container-width);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

**返回顶部按钮：**

```css
.back-to-top {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-glass);
  border: 1px solid var(--color-glass-border);
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.back-to-top:hover {
  color: var(--color-text);
  background: var(--color-glass-hover);
  border-color: var(--color-accent);
}
```

**返回顶部功能：**

```javascript
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
```

**移动端适配：**

```css
@media (max-width: 640px) {
  .footer-inner {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .footer-links {
    justify-content: center;
  }
}
```

## 性能优化

1. **图标优化**：
   - 使用内联SVG，避免图标字体加载
   - SVG设置固定尺寸，减少重绘

2. **链接预取**：
   - 预加载常用链接域名

3. **懒加载**：
   - 二维码图片延迟加载

## 无障碍设计

### 1. 链接可访问性

**描述性文本：**

```html
<!-- 不推荐 -->
<a href="https://github.com">点击这里</a>

<!-- 推荐 -->
<a href="https://github.com" aria-label="访问我的GitHub主页">GitHub</a>
```

**键盘导航：**

- 所有链接可Tab访问
- 焦点样式清晰可见
- 回车键可触发

### 2. 图片替代文本

```html
<img src="qrcode.jpg" alt="微信二维码，扫码添加我的微信" />
```

### 3. ARIA标签

```html
<button class="back-to-top" id="backToTop" aria-label="回到顶部">
  <svg aria-hidden="true">...</svg>
</button>
```

## 相关资源

- HTML模板：`index.html` (第145-175行)
- 页脚模板：`index.html` (第178-189行)
- 样式文件：`src/styles/main.css` (第629-771行)
- 数据绑定：`src/main.js` 中的 bindProfile 函数
- 配置文件：`config/profile.json`

---

## 设计变更日志

| 日期 | 版本 | 变更内容 |
|------|------|----------|
| 2026-05-23 | 1.0 | 初始版本，包含二维码卡片和联系信息 |
| 2026-05-23 | 1.1 | 优化链接按钮悬停效果 |
| 2026-05-23 | 1.2 | 添加页脚和返回顶部功能 |
| 2026-05-23 | 1.3 | 完善响应式布局适配 |
