/**
 * 本地存储管理 - 用户自定义内容的持久化层
 * 优先级：localStorage > JSON 配置文件
 */

const STORAGE_KEYS = {
  profile: 'pw_profile',
  works: 'pw_works',
  contact: 'pw_contact',
  site: 'pw_site',
  theme: 'pw_theme',
  avatar: 'pw_avatar',    // base64 data URL
  qrcode: 'pw_qrcode',    // base64 data URL
  workCovers: 'pw_work_covers', // { workId: base64 }
  messages: 'pw_messages'        // [{ name, email, message, timestamp }]
};

// ===== 读取 =====

export function getProfile() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.profile);
    if (data) return JSON.parse(data);
  } catch { /* ignore */ }
  return null;
}

export function getWorks() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.works);
    if (data) return JSON.parse(data);
  } catch { /* ignore */ }
  return null;
}

export function getContact() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.contact);
    if (data) return JSON.parse(data);
  } catch { /* ignore */ }
  return null;
}

export function getSite() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.site);
    if (data) return JSON.parse(data);
  } catch { /* ignore */ }
  return null;
}

export function getTheme() {
  return localStorage.getItem(STORAGE_KEYS.theme) || 'fluid';
}

export function getAvatar() {
  return localStorage.getItem(STORAGE_KEYS.avatar) || null;
}

export function getQRCode() {
  return localStorage.getItem(STORAGE_KEYS.qrcode) || null;
}

export function getWorkCover(workId) {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.workCovers);
    if (data) {
      const covers = JSON.parse(data);
      return covers[workId] || null;
    }
  } catch { /* ignore */ }
  return null;
}

export function getAllWorkCovers() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.workCovers);
    if (data) return JSON.parse(data);
  } catch { /* ignore */ }
  return {};
}

// ===== 写入 =====

export function saveProfile(data) {
  localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(data));
}

export function saveWorks(data) {
  localStorage.setItem(STORAGE_KEYS.works, JSON.stringify(data));
}

export function saveContact(data) {
  localStorage.setItem(STORAGE_KEYS.contact, JSON.stringify(data));
}

export function saveSite(data) {
  localStorage.setItem(STORAGE_KEYS.site, JSON.stringify(data));
}

export function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEYS.theme, theme);
}

export function saveAvatar(base64) {
  localStorage.setItem(STORAGE_KEYS.avatar, base64);
}

export function saveQRCode(base64) {
  localStorage.setItem(STORAGE_KEYS.qrcode, base64);
}

export function saveWorkCover(workId, base64) {
  const covers = getAllWorkCovers();
  covers[workId] = base64;
  localStorage.setItem(STORAGE_KEYS.workCovers, JSON.stringify(covers));
}

export function removeWorkCover(workId) {
  const covers = getAllWorkCovers();
  delete covers[workId];
  localStorage.setItem(STORAGE_KEYS.workCovers, JSON.stringify(covers));
}

// ===== 消息管理 =====

export function getMessages() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.messages);
    if (data) return JSON.parse(data);
  } catch { /* ignore */ }
  return [];
}

export function deleteMessage(index) {
  const messages = getMessages();
  messages.splice(index, 1);
  localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages));
}

export function clearMessages() {
  localStorage.removeItem(STORAGE_KEYS.messages);
}

// ===== 图片文件转 base64 =====

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ===== 导出全部数据 =====

export function exportAllData() {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    profile: getProfile(),
    works: getWorks(),
    contact: getContact(),
    site: getSite(),
    theme: getTheme(),
    avatar: getAvatar(),
    qrcode: getQRCode(),
    workCovers: getAllWorkCovers(),
    messages: getMessages()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ===== 导入数据 =====

export function importAllData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (!data.version) throw new Error('Invalid backup format');

    if (data.profile) saveProfile(data.profile);
    if (data.works) saveWorks(data.works);
    if (data.contact) saveContact(data.contact);
    if (data.site) saveSite(data.site);
    if (data.theme) saveTheme(data.theme);
    if (data.avatar) saveAvatar(data.avatar);
    if (data.qrcode) saveQRCode(data.qrcode);
    if (data.workCovers) {
      localStorage.setItem(STORAGE_KEYS.workCovers, JSON.stringify(data.workCovers));
    }
    if (data.messages) {
      localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(data.messages));
    }
    return true;
  } catch (e) {
    console.error('Import failed:', e);
    return false;
  }
}

// ===== 清除全部自定义数据（恢复默认） =====

export function clearAllData() {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}
