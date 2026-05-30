import * as THREE from 'three';
import fluidVert from '/shaders/fluid.vert?raw';
import fluidFrag from '/shaders/fluid.frag?raw';
import { getScene, getPerfTier, addRenderCallback, removeRenderCallback } from '../scene.js';

const themeColors = {
  fluid:  { color1: '#1a1a2e', color2: '#e94560', color3: '#0f3460' },
  cosmos: { color1: '#0a0a1a', color2: '#4a4ae8', color3: '#1a1a4e' },
  ocean:  { color1: '#0a1a2a', color2: '#00b4d8', color3: '#0077b6' }
};

const SCROLL_SPEED = 0.08;

let mesh, material;
let mouseTarget = new THREE.Vector2(0, 0);
let mouseCurrent = new THREE.Vector2(0, 0);
let scrollProgress = 0;
let currentTheme = 'fluid';
let targetOpacity = 1;
let currentOpacity = 1;
const FADE_SPEED = 0.04;
let tickFn = null;

export function initFluidBackground() {
  const scene = getScene();
  if (!scene) return;

  const colors = themeColors[currentTheme];
  const c1 = new THREE.Color(colors.color1);
  const c2 = new THREE.Color(colors.color2);
  const c3 = new THREE.Color(colors.color3);

  const uniforms = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uColor1: { value: c1 },
    uColor2: { value: c2 },
    uColor3: { value: c3 },
    uScrollProgress: { value: 0 },
    uOpacity: { value: 1.0 }
  };

  material = new THREE.ShaderMaterial({
    vertexShader: fluidVert,
    fragmentShader: fluidFrag,
    uniforms,
    depthWrite: false,
    depthTest: false
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  scene.add(mesh);

  // 鼠标追踪
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', onResize);

  // 渲染回调
  tickFn = (time) => {
    uniforms.uTime.value = time;

    // 平滑鼠标
    mouseCurrent.lerp(mouseTarget, 0.03);
    uniforms.uMouse.value.set(mouseCurrent.x, mouseCurrent.y);

    // 滚动进度平滑
    scrollProgress += (getScrollRatio() - scrollProgress) * SCROLL_SPEED;
    uniforms.uScrollProgress.value = scrollProgress;

    // 平滑淡入淡出
    currentOpacity += (targetOpacity - currentOpacity) * FADE_SPEED;
    uniforms.uOpacity.value = currentOpacity;
  };
  addRenderCallback(tickFn);
}

export function setFluidOpacity(opacity) {
  targetOpacity = opacity;
}

export function getFluidOpacity() {
  return currentOpacity;
}

export function switchFluidTheme(theme) {
  if (!themeColors[theme]) return;
  currentTheme = theme;

  const colors = themeColors[theme];
  material.uniforms.uColor1.value.set(colors.color1);
  material.uniforms.uColor2.value.set(colors.color2);
  material.uniforms.uColor3.value.set(colors.color3);
}

export function disposeFluidBackground() {
  if (tickFn) removeRenderCallback(tickFn);
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('resize', onResize);

  if (mesh) {
    mesh.geometry.dispose();
    material.dispose();
    mesh.parent?.remove(mesh);
    mesh = null;
    material = null;
  }
}

// --- internal ---

function onMouseMove(e) {
  mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1;
}

function onResize() {
  if (material) {
    material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  }
}

function getScrollRatio() {
  const h = document.documentElement.scrollHeight - window.innerHeight;
  return h > 0 ? window.scrollY / h : 0;
}
