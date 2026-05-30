/**
 * 背景音乐播放器
 * 音频文件放在 /public/audio/bg-music.mp3
 * 首次用户交互后自动播放，支持暂停/恢复，状态持久化
 */

let audio = null;
let isPlaying = false;
let hasInteracted = false;
let volume = 0.3;
let btn = null;

export function initAudioPlayer() {
  // 读取保存的设置
  try {
    const saved = JSON.parse(localStorage.getItem('pw_audio_settings'));
    if (saved) {
      volume = saved.volume ?? 0.3;
    }
  } catch { /* ignore */ }

  // 创建音频元素
  audio = new Audio('/audio/bg-music.mp3');
  audio.loop = true;
  audio.volume = volume;
  audio.preload = 'auto';

  // 创建按钮
  btn = document.createElement('button');
  btn.className = 'audio-btn';
  btn.setAttribute('aria-label', '背景音乐');
  btn.innerHTML = getIcon(false);

  // 样式
  const style = document.createElement('style');
  style.textContent = `
    .audio-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      outline: none;
    }
    .audio-btn:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.25);
      color: #fff;
      box-shadow: 0 0 20px rgba(233, 69, 96, 0.25);
    }
    .audio-btn.playing {
      border-color: rgba(233, 69, 96, 0.5);
      color: var(--color-accent, #e94560);
      animation: audioPulse 2s ease-in-out infinite;
    }
    @keyframes audioPulse {
      0%, 100% { box-shadow: 0 0 8px rgba(233, 69, 96, 0.3); }
      50% { box-shadow: 0 0 24px rgba(233, 69, 96, 0.55); }
    }
    .audio-btn .eq-bars {
      display: none;
    }
    .audio-btn.playing .eq-bars {
      display: flex;
    }
    .audio-btn.playing .note-icon {
      display: none;
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(btn);

  // 事件
  btn.addEventListener('click', toggle);

  // 首次用户交互后尝试自动播放
  const tryAutoPlay = () => {
    if (!hasInteracted && !isPlaying) {
      hasInteracted = true;
      play();
    }
  };
  document.addEventListener('click', tryAutoPlay, { once: true });
  document.addEventListener('keydown', tryAutoPlay, { once: true });
  document.addEventListener('scroll', tryAutoPlay, { once: true });
}

function toggle() {
  if (isPlaying) {
    pause();
  } else {
    play();
  }
}

function play() {
  if (!audio) return;
  audio.play().then(() => {
    isPlaying = true;
    updateUI();
    saveSettings();
  }).catch(() => {
    // 浏览器可能阻止自动播放，用户需要手动点击
    isPlaying = false;
    updateUI();
  });
}

function pause() {
  if (!audio) return;
  audio.pause();
  isPlaying = false;
  updateUI();
  saveSettings();
}

function updateUI() {
  if (!btn) return;
  btn.innerHTML = getIcon(isPlaying);
  btn.classList.toggle('playing', isPlaying);
  btn.setAttribute('aria-label', isPlaying ? '暂停音乐' : '播放音乐');
}

function getIcon(playing) {
  if (playing) {
    return `
      <div class="eq-bars" style="display:flex;gap:2px;align-items:flex-end;height:14px">
        <span style="width:2px;height:8px;background:currentColor;border-radius:1px;animation:eq1 0.5s ease-in-out infinite alternate"></span>
        <span style="width:2px;height:14px;background:currentColor;border-radius:1px;animation:eq2 0.6s ease-in-out infinite alternate"></span>
        <span style="width:2px;height:5px;background:currentColor;border-radius:1px;animation:eq3 0.45s ease-in-out infinite alternate"></span>
        <span style="width:2px;height:12px;background:currentColor;border-radius:1px;animation:eq4 0.55s ease-in-out infinite alternate"></span>
      </div>
      <style>
        @keyframes eq1 { to { height: 14px; } }
        @keyframes eq2 { to { height: 5px; } }
        @keyframes eq3 { to { height: 13px; } }
        @keyframes eq4 { to { height: 6px; } }
      </style>`;
  }
  return `
    <svg class="note-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
    </svg>`;
}

function saveSettings() {
  try {
    localStorage.setItem('pw_audio_settings', JSON.stringify({ volume }));
  } catch { /* ignore */ }
}

export function setVolume(v) {
  volume = Math.max(0, Math.min(1, v));
  if (audio) audio.volume = volume;
  saveSettings();
}

export function isAudioPlaying() {
  return isPlaying;
}
