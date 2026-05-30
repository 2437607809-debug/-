import {
  getProfile, getWorks, getContact, getSite, getTheme,
  getAvatar, getQRCode, getAllWorkCovers,
  saveProfile, saveWorks, saveContact, saveSite, saveTheme,
  saveAvatar, saveQRCode, saveWorkCover, removeWorkCover,
  getMessages, deleteMessage, clearMessages,
  fileToBase64, exportAllData, importAllData, clearAllData
} from './utils/storage.js';

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', async () => {
  initTabs();
  await loadAllData();
  bindEvents();
});

function initTabs() {
  document.querySelectorAll('#tabNav .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#tabNav .tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
    });
  });
}

// ===== 加载数据 =====
async function loadAllData() {
  // 加载 JSON 默认值
  const [defaultProfile, defaultWorks, defaultContact, defaultSite] = await Promise.all([
    fetch('/config/profile.json').then(r => r.json()).catch(() => ({})),
    fetch('/config/works.json').then(r => r.json()).catch(() => ({ items: [], categories: ['全部'] })),
    fetch('/config/contact.json').then(r => r.json()).catch(() => ({})),
    fetch('/config/site.json').then(r => r.json()).catch(() => ({}))
  ]);

  // localStorage 数据优先
  const profile = getProfile() || defaultProfile;
  const works = getWorks() || defaultWorks;
  const contact = getContact() || defaultContact;
  const site = getSite() || defaultSite;
  const theme = getTheme() || 'fluid';

  // 暂存当前数据
  window._data = { profile, works, contact, site, theme, defaultProfile, defaultWorks, defaultContact, defaultSite };

  // 填充表单
  populateProfile(profile);
  populateWorks(works);
  populateContact(contact);
  populateSettings(site, theme);
  populateAvatar();
  populateQRCode();
  populateMessages();
}

// ===== 填充个人资料 =====
function populateProfile(p) {
  document.getElementById('profileName').value = p.name || '';
  document.getElementById('profileTitle').value = p.title || '';
  document.getElementById('profileBio').value = p.bio || '';
  document.getElementById('profileEmail').value = p.email || '';
  document.getElementById('profileGithub').value = p.github || '';

  renderSkills(p.skills || []);
  renderExperience(p.experience || []);
  renderEducation(p.education || []);
}

function renderSkills(skills) {
  const container = document.getElementById('skillsContainer');
  container.innerHTML = skills.map((s, i) => `
    <div class="skill-row">
      <div class="form-row">
        <input type="text" value="${escapeHtml(s.name)}" placeholder="技能名称" data-skill-name="${i}" />
        <input type="number" value="${s.level}" placeholder="熟练度" min="0" max="100" data-skill-level="${i}" />
        <button class="btn-icon row-remove" onclick="this.parentElement.parentElement.remove()" title="删除">×</button>
      </div>
    </div>
  `).join('');
}

function renderExperience(exp) {
  const container = document.getElementById('expContainer');
  container.innerHTML = exp.map((e, i) => `
    <div class="exp-row">
      <button class="row-remove" onclick="this.parentElement.remove()" title="删除">×</button>
      <div class="form-row">
        <input type="text" value="${escapeHtml(e.company)}" placeholder="公司名称" data-exp-company="${i}" />
        <input type="text" value="${escapeHtml(e.role)}" placeholder="职位" data-exp-role="${i}" />
      </div>
      <div class="form-row" style="margin-top:8px">
        <input type="text" value="${escapeHtml(e.period)}" placeholder="时间，如 2023 - 至今" data-exp-period="${i}" />
      </div>
      <textarea style="margin-top:8px" placeholder="工作描述" data-exp-desc="${i}">${escapeHtml(e.description || '')}</textarea>
    </div>
  `).join('');
}

function renderEducation(edu) {
  const container = document.getElementById('eduContainer');
  container.innerHTML = edu.map((e, i) => `
    <div class="edu-row">
      <button class="row-remove" onclick="this.parentElement.remove()" title="删除">×</button>
      <div class="form-row">
        <input type="text" value="${escapeHtml(e.school)}" placeholder="学校名称" data-edu-school="${i}" />
        <input type="text" value="${escapeHtml(e.major)}" placeholder="专业" data-edu-major="${i}" />
      </div>
      <div class="form-row" style="margin-top:8px">
        <input type="text" value="${escapeHtml(e.period)}" placeholder="时间，如 2016 - 2020" data-edu-period="${i}" />
        <input type="text" value="${escapeHtml(e.degree || '')}" placeholder="学位，如 本科" data-edu-degree="${i}" />
      </div>
    </div>
  `).join('');
}

// ===== 填充作品 =====
function populateWorks(w) {
  document.getElementById('worksCategories').value = (w.categories || ['全部']).join(', ');
  renderWorks(w.items || []);
}

function renderWorks(items) {
  const container = document.getElementById('worksContainer');
  container.innerHTML = items.map((item, i) => `
    <div class="work-row">
      <button class="row-remove" onclick="Admin.removeWorkCover(${item.id}); this.parentElement.remove()" title="删除">×</button>
      <div class="form-row">
        <input type="text" value="${escapeHtml(item.title)}" placeholder="作品标题" data-work-title="${i}" />
        <input type="text" value="${escapeHtml(item.category)}" placeholder="分类" data-work-cat="${i}" />
      </div>
      <textarea style="margin-top:8px" placeholder="作品描述" data-work-desc="${i}">${escapeHtml(item.description || '')}</textarea>
      <div class="form-row" style="margin-top:8px">
        <input type="text" value="${escapeHtml((item.tags || []).join(', '))}" placeholder="标签（逗号分隔）" data-work-tags="${i}" />
        <input type="url" value="${escapeHtml(item.link || '')}" placeholder="链接（可选）" data-work-link="${i}" />
      </div>
      <div style="margin-top:8px">
        <label style="font-size:0.78rem;color:var(--text2)">封面图</label>
        <div class="upload-area ${getWorkCoverPreview(item.id) ? 'has-image' : ''}" style="padding:16px"
             onclick="document.getElementById('workCoverInput${i}').click()">
          <img class="upload-preview" id="workCoverPreview${i}" src="${getWorkCoverPreview(item.id) || ''}" />
          <div class="upload-hint">点击上传封面</div>
        </div>
        <input type="file" id="workCoverInput${i}" accept="image/*" style="display:none"
               onchange="Admin.handleWorkCoverUpload(this, ${item.id})" />
      </div>
    </div>
  `).join('');

  if (items.length === 0) {
    container.innerHTML = '<p style="color:var(--text2);padding:20px 0">暂无作品，点击下方按钮添加。</p>';
  }
}

function getWorkCoverPreview(workId) {
  const covers = getAllWorkCovers();
  return covers[workId] || '';
}

// ===== 填充联系方式 =====
function populateContact(c) {
  document.getElementById('contactEmail').value = c.email || '';
  document.getElementById('contactGithub').value = c.github || '';
}

function populateAvatar() {
  const avatar = getAvatar();
  if (avatar) {
    document.getElementById('avatarPreview').src = avatar;
    document.getElementById('avatarUpload').classList.add('has-image');
  }
}

function populateQRCode() {
  const qr = getQRCode();
  if (qr) {
    document.getElementById('qrcodePreview').src = qr;
    document.getElementById('qrcodeUpload').classList.add('has-image');
  }
}

// ===== 填充网站设置 =====
function populateSettings(site, theme) {
  document.getElementById('siteTitle').value = site.title || '';
  document.getElementById('siteDesc').value = site.description || '';
  document.getElementById('siteHeroText').value = site.heroText || "Hi, I'm XXX";
  document.getElementById('siteHeroSubtitle').value = site.subtitle || '';
  document.getElementById('siteHeroDesc').value = site.heroDesc || '';
  document.getElementById('siteTheme').value = theme;
}

// ===== 收集表单数据 =====
function collectProfile() {
  const skills = [];
  document.querySelectorAll('#skillsContainer .skill-row').forEach(row => {
    const name = row.querySelector('[data-skill-name]')?.value.trim();
    const level = parseInt(row.querySelector('[data-skill-level]')?.value) || 80;
    if (name) skills.push({ name, level });
  });

  const experience = [];
  document.querySelectorAll('#expContainer .exp-row').forEach(row => {
    const company = row.querySelector('[data-exp-company]')?.value.trim();
    const role = row.querySelector('[data-exp-role]')?.value.trim();
    const period = row.querySelector('[data-exp-period]')?.value.trim();
    const description = row.querySelector('[data-exp-desc]')?.value.trim();
    if (company) experience.push({ company, role, period, description });
  });

  const education = [];
  document.querySelectorAll('#eduContainer .edu-row').forEach(row => {
    const school = row.querySelector('[data-edu-school]')?.value.trim();
    const major = row.querySelector('[data-edu-major]')?.value.trim();
    const period = row.querySelector('[data-edu-period]')?.value.trim();
    const degree = row.querySelector('[data-edu-degree]')?.value.trim();
    if (school) education.push({ school, major, period, degree });
  });

  return {
    name: document.getElementById('profileName').value.trim(),
    title: document.getElementById('profileTitle').value.trim(),
    bio: document.getElementById('profileBio').value.trim(),
    email: document.getElementById('profileEmail').value.trim(),
    github: document.getElementById('profileGithub').value.trim(),
    avatar: getAvatar() || '',
    skills,
    experience,
    education
  };
}

function collectWorks() {
  const categoriesStr = document.getElementById('worksCategories').value.trim();
  const categories = categoriesStr ? categoriesStr.split(/[,，]/).map(s => s.trim()).filter(Boolean) : ['全部'];
  if (!categories.includes('全部')) categories.unshift('全部');

  const items = [];
  document.querySelectorAll('#worksContainer .work-row').forEach((row, i) => {
    const title = row.querySelector('[data-work-title]')?.value.trim();
    if (!title) return;
    const category = row.querySelector('[data-work-cat]')?.value.trim() || '其他';
    const description = row.querySelector('[data-work-desc]')?.value.trim();
    const tagsStr = row.querySelector('[data-work-tags]')?.value.trim();
    const tags = tagsStr ? tagsStr.split(/[,，]/).map(s => s.trim()).filter(Boolean) : [];
    const link = row.querySelector('[data-work-link]')?.value.trim();

    // 用 index 作为 id 保证唯一性
    const id = i + 1;
    items.push({ id, title, description, category, tags, link, cover: '' });
  });

  return { categories, items };
}

function collectContact() {
  return {
    email: document.getElementById('contactEmail').value.trim(),
    github: document.getElementById('contactGithub').value.trim(),
    wechat_qrcode: getQRCode() || ''
  };
}

function collectSite() {
  return {
    title: document.getElementById('siteTitle').value.trim(),
    description: document.getElementById('siteDesc').value.trim(),
    heroText: document.getElementById('siteHeroText').value.trim(),
    subtitle: document.getElementById('siteHeroSubtitle').value.trim(),
    heroDesc: document.getElementById('siteHeroDesc').value.trim(),
    language: 'zh-CN',
    keywords: '前端开发, 3D可视化, WebGL, Three.js'
  };
}

// ===== 保存 =====
function saveAll() {
  saveProfile(collectProfile());
  saveWorks(collectWorks());
  saveContact(collectContact());
  saveSite(collectSite());
  saveTheme(document.getElementById('siteTheme').value);

  // 同步更新 localStorage 中的 avatar/qrcode（已在 handle*Upload 中处理）
  showToast('全部已保存！刷新主页面即可看到更新');
}

// ===== 图片上传 =====
async function handleAvatarUpload(input) {
  const file = input.files[0];
  if (!file) return;
  const base64 = await fileToBase64(file);
  saveAvatar(base64);
  document.getElementById('avatarPreview').src = base64;
  document.getElementById('avatarUpload').classList.add('has-image');
  showToast('头像已上传');
}

async function handleQRCodeUpload(input) {
  const file = input.files[0];
  if (!file) return;
  const base64 = await fileToBase64(file);
  saveQRCode(base64);
  document.getElementById('qrcodePreview').src = base64;
  document.getElementById('qrcodeUpload').classList.add('has-image');
  showToast('二维码已上传');
}

async function handleWorkCoverUpload(input, workId) {
  const file = input.files[0];
  if (!file) return;
  const base64 = await fileToBase64(file);
  saveWorkCover(workId, base64);

  // 找到对应的预览图
  const idx = Array.from(document.querySelectorAll('#worksContainer .work-row')).findIndex(
    row => row.querySelector(`[onclick*="workCoverInput"]`)
  );
  // 用 workId 找到预览元素
  const preview = document.getElementById(`workCoverPreview${findWorkRowIndex(workId)}`);
  if (preview) {
    preview.src = base64;
    preview.closest('.upload-area').classList.add('has-image');
  }
  showToast('作品封面已上传');
}

function findWorkRowIndex(workId) {
  // 遍历所有 work row，找到对应的 index
  const rows = document.querySelectorAll('#worksContainer .work-row');
  for (let i = 0; i < rows.length; i++) {
    const input = rows[i].querySelector('input[type="file"]');
    if (input && input.id === `workCoverInput${i}`) {
      return i;
    }
  }
  return 0;
}

// ===== 添加/删除 =====
function addSkill() {
  const container = document.getElementById('skillsContainer');
  const div = document.createElement('div');
  div.className = 'skill-row';
  div.innerHTML = `
    <div class="form-row">
      <input type="text" placeholder="技能名称" />
      <input type="number" value="80" placeholder="熟练度" min="0" max="100" />
      <button class="btn-icon row-remove" onclick="this.parentElement.parentElement.remove()" title="删除">×</button>
    </div>
  `;
  container.appendChild(div);
}

function addExperience() {
  const container = document.getElementById('expContainer');
  const div = document.createElement('div');
  div.className = 'exp-row';
  div.innerHTML = `
    <button class="row-remove" onclick="this.parentElement.remove()" title="删除">×</button>
    <div class="form-row">
      <input type="text" placeholder="公司名称" />
      <input type="text" placeholder="职位" />
    </div>
    <div class="form-row" style="margin-top:8px">
      <input type="text" placeholder="时间，如 2023 - 至今" />
    </div>
    <textarea style="margin-top:8px" placeholder="工作描述"></textarea>
  `;
  container.appendChild(div);
}

function addEducation() {
  const container = document.getElementById('eduContainer');
  const div = document.createElement('div');
  div.className = 'edu-row';
  div.innerHTML = `
    <button class="row-remove" onclick="this.parentElement.remove()" title="删除">×</button>
    <div class="form-row">
      <input type="text" placeholder="学校名称" />
      <input type="text" placeholder="专业" />
    </div>
    <div class="form-row" style="margin-top:8px">
      <input type="text" placeholder="时间，如 2016 - 2020" />
      <input type="text" placeholder="学位，如 本科" />
    </div>
  `;
  container.appendChild(div);
}

function addWork() {
  const container = document.getElementById('worksContainer');
  if (container.querySelector('p')) container.innerHTML = '';
  const idx = container.children.length;
  const newId = Date.now();
  const div = document.createElement('div');
  div.className = 'work-row';
  div.innerHTML = `
    <button class="row-remove" onclick="Admin.removeWorkCover(${newId}); this.parentElement.remove()" title="删除">×</button>
    <div class="form-row">
      <input type="text" placeholder="作品标题" />
      <input type="text" placeholder="分类" />
    </div>
    <textarea style="margin-top:8px" placeholder="作品描述"></textarea>
    <div class="form-row" style="margin-top:8px">
      <input type="text" placeholder="标签（逗号分隔）" />
      <input type="url" placeholder="链接（可选）" />
    </div>
    <div style="margin-top:8px">
      <label style="font-size:0.78rem;color:var(--text2)">封面图</label>
      <div class="upload-area" style="padding:16px"
           onclick="document.getElementById('workCoverInput_new${idx}').click()">
        <img class="upload-preview" id="workCoverPreview_new${idx}" />
        <div class="upload-hint">点击上传封面</div>
      </div>
      <input type="file" id="workCoverInput_new${idx}" accept="image/*" style="display:none"
             onchange="Admin.handleWorkCoverUpload(this, ${newId})" />
    </div>
  `;
  container.appendChild(div);
}

// ===== 导出/导入/重置 =====
function exportData() { exportAllData(); showToast('数据已导出'); }
function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const ok = importAllData(text);
    if (ok) {
      showToast('数据已导入，页面即将刷新...');
      setTimeout(() => location.reload(), 800);
    } else {
      showToast('导入失败：文件格式不正确', true);
    }
  };
  input.click();
}

function resetAll() {
  if (!confirm('确定要恢复所有默认设置吗？上传的头像和二维码也会被清除。')) return;
  clearAllData();
  showToast('已恢复默认，页面即将刷新...');
  setTimeout(() => location.reload(), 800);
}

// ===== 消息管理 =====
function populateMessages() {
  const messages = getMessages();
  const container = document.getElementById('messagesContainer');
  if (!container) return;

  if (messages.length === 0) {
    container.innerHTML = '<p style="color:var(--text2);padding:20px 0">暂无消息</p>';
    return;
  }

  container.innerHTML = messages.map((msg, i) => `
    <div class="msg-card">
      <button class="msg-delete" onclick="Admin.deleteMsg(${i})" title="删除">×</button>
      <div class="msg-header">
        <div class="msg-from">${escapeHtml(msg.name)} <span>&lt;${escapeHtml(msg.email)}&gt;</span></div>
        <div class="msg-time">${formatDate(msg.timestamp)}</div>
      </div>
      <div class="msg-body">${escapeHtml(msg.message)}</div>
      <a class="msg-reply" href="mailto:${escapeHtml(msg.email)}?subject=回复: 来自个人网站的留言">回复邮件</a>
    </div>
  `).join('');
}

function deleteMsg(index) {
  if (!confirm('确定删除这条消息？')) return;
  deleteMessage(index);
  populateMessages();
  showToast('消息已删除');
}

function clearAllMessages() {
  if (!confirm('确定清空所有消息？此操作不可恢复。')) return;
  clearMessages();
  populateMessages();
  showToast('所有消息已清空');
}

function formatDate(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return isoString;
  }
}

// ===== Toast =====
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast ${isError ? 'error' : ''} show`;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.className = 'toast'; }, 2000);
}

// ===== 工具函数 =====
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== 事件绑定 =====
function bindEvents() {
  // 防止表单回车提交
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
      e.preventDefault();
    }
  });
}

// ===== 暴露到全局 =====
window.Admin = {
  saveAll,
  addSkill, addExperience, addEducation, addWork,
  handleAvatarUpload, handleQRCodeUpload, handleWorkCoverUpload,
  removeWorkCover,
  deleteMsg, clearAllMessages,
  exportData, importData, resetAll
};
