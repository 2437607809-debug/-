/**
 * 加载 JSON 配置文件
 */
export async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

export function loadProfile() {
  return loadJSON('/config/profile.json');
}

export function loadWorks() {
  return loadJSON('/config/works.json');
}

export function loadContact() {
  return loadJSON('/config/contact.json');
}

export function loadThemes() {
  return loadJSON('/config/themes.json');
}
