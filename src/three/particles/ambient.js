import * as THREE from 'three';
import { getScene, getPerfTier, addRenderCallback, removeRenderCallback } from '../scene.js';

const themeColors = {
  fluid:  { primary: '#e94560', secondary: '#0f3460' },
  cosmos: { primary: '#4a4ae8', secondary: '#1a1a4e' },
  ocean:  { primary: '#00b4d8', secondary: '#0077b6' }
};

// 根据性能等级确定粒子数量
const PARTICLE_COUNTS = { high: 1200, medium: 600, low: 300 };

let particles, material;
let currentTheme = 'fluid';
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;
let tickFn = null;

export function initAmbientParticles() {
  const scene = getScene();
  if (!scene) return;

  const count = PARTICLE_COUNTS[getPerfTier()] || 300;
  const colors = themeColors[currentTheme];
  const c1 = new THREE.Color(colors.primary);
  const c2 = new THREE.Color(colors.secondary);

  const positions = new Float32Array(count * 3);
  const colAttr = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    // 球形分布，半径 8-15
    const r = 8 + Math.random() * 7;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi) - 3; // 偏移到相机后方

    const mixRatio = Math.random();
    const color = c1.clone().lerp(c2, mixRatio);
    colAttr[i3] = color.r;
    colAttr[i3 + 1] = color.g;
    colAttr[i3 + 2] = color.b;

    sizes[i] = Math.random() * 2.5 + 0.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colAttr, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  material = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  document.addEventListener('mousemove', onMouseMove);

  tickFn = (time) => {
    mouseX += (targetMouseX - mouseX) * 0.03;
    mouseY += (targetMouseY - mouseY) * 0.03;

    // 粒子整体缓慢旋转
    particles.rotation.y += 0.0003;
    particles.rotation.x += Math.sin(time * 0.3) * 0.0002;

    // 鼠标影响粒子旋转（视差感）
    particles.rotation.y += mouseX * 0.0001;
    particles.rotation.x += mouseY * 0.0001;

    // 更新每个粒子位置（波动效果）
    const pos = particles.geometry.attributes.position.array;
    for (let i = 0; i < pos.length / 3; i++) {
      const i3 = i * 3;
      const x = pos[i3];
      const y = pos[i3 + 1];
      pos[i3 + 1] = y + Math.sin(time * 0.8 + x * 0.3) * 0.015;
      pos[i3] = x + Math.cos(time * 0.6 + y * 0.3) * 0.01;
    }
    particles.geometry.attributes.position.needsUpdate = true;
  };
  addRenderCallback(tickFn);
}

export function switchParticleTheme(theme) {
  if (!themeColors[theme]) return;
  currentTheme = theme;

  const colors = themeColors[theme];
  const c1 = new THREE.Color(colors.primary);
  const c2 = new THREE.Color(colors.secondary);
  const colAttr = particles.geometry.attributes.color.array;

  for (let i = 0; i < colAttr.length / 3; i++) {
    const i3 = i * 3;
    const color = c1.clone().lerp(c2, Math.random());
    colAttr[i3] = color.r;
    colAttr[i3 + 1] = color.g;
    colAttr[i3 + 2] = color.b;
  }
  particles.geometry.attributes.color.needsUpdate = true;
}

export function disposeAmbientParticles() {
  if (tickFn) removeRenderCallback(tickFn);
  document.removeEventListener('mousemove', onMouseMove);

  if (particles) {
    particles.geometry.dispose();
    material.dispose();
    particles.parent?.remove(particles);
    particles = null;
    material = null;
  }
}

function onMouseMove(e) {
  targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
  targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
}
