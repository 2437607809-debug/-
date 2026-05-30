import * as THREE from 'three';
import { getScene, getCamera, addRenderCallback, removeRenderCallback } from '../scene.js';

/**
 * 图片背景模块
 * - 全屏纹理平面，置于着色器背景之后
 * - 按视口比例计算平面尺寸，确保图片铺满整个屏幕
 * - Ken Burns 效果：缓慢呼吸式缩放 + 鼠标视差
 * - 支持与着色器背景的交叉淡入淡出
 */

const KEN_BURNS_MIN_SCALE = 1.0;   // 最小缩放（刚好填满）
const KEN_BURNS_ZOOM_RANGE = 0.18; // 缩放幅度（越大越明显）
const KEN_BURNS_SPEED = 0.012;     // 缩放速度
const PARALLAX_STRENGTH = 0.025;   // 鼠标视差强度
const FADE_SPEED = 0.03;           // 淡入淡出速度

let mesh, material, texture;
let mouseTarget = new THREE.Vector2(0, 0);
let mouseCurrent = new THREE.Vector2(0, 0);
let scaleProgress = 0;
let scaleDirection = 1;
let targetOpacity = 0;
let currentOpacity = 0;
let isActive = false;
let tickFn = null;

export function initImageBackground(imagePath) {
  const scene = getScene();
  if (!scene) return;

  const loader = new THREE.TextureLoader();
  texture = loader.load(
    imagePath,
    () => { /* loaded */ },
    undefined,
    (err) => console.warn('背景图片加载失败:', err)
  );
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    depthTest: false
  });

  // 按实际视口尺寸创建平面，确保铺满全屏
  const size = calcPlaneSize();
  const geometry = new THREE.PlaneGeometry(size.width, size.height);
  mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.renderOrder = -10;
  scene.add(mesh);

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', onResize);

  tickFn = (time) => {
    if (!material) return;

    // 平滑淡入淡出
    currentOpacity += (targetOpacity - currentOpacity) * FADE_SPEED;
    material.opacity = currentOpacity;

    if (currentOpacity < 0.01) return;

    // Ken Burns 缩放
    scaleProgress += KEN_BURNS_SPEED * 0.001 * scaleDirection;
    if (scaleProgress >= 1) { scaleProgress = 1; scaleDirection = -1; }
    if (scaleProgress <= 0) { scaleProgress = 0; scaleDirection = 1; }

    const currentScale = KEN_BURNS_MIN_SCALE + scaleProgress * KEN_BURNS_ZOOM_RANGE;
    mesh.scale.setScalar(currentScale);

    // 鼠标视差
    mouseCurrent.lerp(mouseTarget, 0.02);
    mesh.position.x = mouseCurrent.x * PARALLAX_STRENGTH * currentScale;
    mesh.position.y = mouseCurrent.y * PARALLAX_STRENGTH * currentScale;
  };
  addRenderCallback(tickFn);
}

export function switchToImageBg(fadeIn = true) {
  targetOpacity = fadeIn ? 0.85 : 0;
  isActive = fadeIn;
}

export function switchToShaderBg() {
  targetOpacity = 0;
  isActive = false;
}

export function isImageBgActive() {
  return isActive || currentOpacity > 0.01;
}

export function getImageBgOpacity() {
  return currentOpacity;
}

export function disposeImageBackground() {
  if (tickFn) removeRenderCallback(tickFn);
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('resize', onResize);

  if (mesh) {
    mesh.geometry.dispose();
    material.dispose();
    if (texture) texture.dispose();
    mesh.parent?.remove(mesh);
    mesh = null;
    material = null;
    texture = null;
  }
}

// --- internal ---

function calcPlaneSize() {
  const camera = getCamera();
  if (!camera) return { width: 2, height: 2 };

  // 计算摄像机前方 z=0 处刚好填满视口的平面尺寸
  const vFov = camera.fov * Math.PI / 180;
  const height = 2 * Math.tan(vFov / 2) * camera.position.z;
  const aspect = window.innerWidth / window.innerHeight;
  const width = height * aspect;

  // 额外放大，给 Ken Burns 缩放留出余量
  const margin = 1 + KEN_BURNS_ZOOM_RANGE;
  return { width: width * margin, height: height * margin };
}

function onResize() {
  if (!mesh) return;
  const size = calcPlaneSize();
  mesh.geometry.dispose();
  mesh.geometry = new THREE.PlaneGeometry(size.width, size.height);
}

function onMouseMove(e) {
  mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1;
}
