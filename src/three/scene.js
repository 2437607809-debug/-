import * as THREE from 'three';

/**
 * Three.js 场景管理器
 * 负责场景/相机/渲染器的创建、生命周期、窗口适配
 */
let scene, camera, renderer;
let animationId = null;
let isRunning = false;
let resizeTimer = null;
let renderFn = null; // 可由后处理模块覆盖
const callbacks = [];

// 性能等级: 'high' | 'medium' | 'low'
let perfTier = 'high';

export function getScene() { return scene; }
export function getCamera() { return camera; }
export function getRenderer() { return renderer; }
export function getPerfTier() { return perfTier; }

export function initScene(canvas) {
  // 性能检测
  detectPerfTier();

  // 场景
  scene = new THREE.Scene();

  // 相机
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // 渲染器
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: perfTier !== 'low',
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, perfTier === 'low' ? 1.5 : 2));

  // 窗口 resize
  window.addEventListener('resize', onResize);

  // 页面不可见时停止渲染
  document.addEventListener('visibilitychange', onVisibilityChange);

  isRunning = true;
  return { scene, camera, renderer };
}

export function setRenderFn(fn) { renderFn = fn; }

export function addRenderCallback(fn) {
  callbacks.push(fn);
}

export function removeRenderCallback(fn) {
  const idx = callbacks.indexOf(fn);
  if (idx !== -1) callbacks.splice(idx, 1);
}

export function startLoop() {
  if (animationId) return;

  function tick(time) {
    animationId = requestAnimationFrame(tick);
    for (const cb of callbacks) {
      cb(time * 0.001);
    }
    if (renderFn) {
      renderFn(time);
    } else {
      renderer.render(scene, camera);
    }
  }

  animationId = requestAnimationFrame(tick);
}

export function stopLoop() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

export function dispose() {
  stopLoop();
  window.removeEventListener('resize', onResize);
  document.removeEventListener('visibilitychange', onVisibilityChange);
  callbacks.length = 0;

  if (renderer) {
    renderer.dispose();
    renderer = null;
  }
  scene = null;
  camera = null;
  isRunning = false;
}

// --- internal ---

function onResize() {
  // 防抖：避免拖拽窗口时高频触发
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, 150);
}

function onVisibilityChange() {
  if (!isRunning) return;
  if (document.hidden) {
    stopLoop();
  } else {
    startLoop();
  }
}

function detectPerfTier() {
  // 粗略性能检测：移动端 + 低内存 -> low
  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
  const memory = navigator.deviceMemory || 8; // GB, Chrome only

  if (isMobile && memory < 4) {
    perfTier = 'low';
  } else if (isMobile || memory < 4) {
    perfTier = 'medium';
  } else {
    perfTier = 'high';
  }
}
