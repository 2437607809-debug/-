import * as THREE from 'three';
import { getScene, getPerfTier, addRenderCallback, removeRenderCallback } from '../scene.js';

const themeColors = {
  fluid:  ['#e94560', '#ff6b8a'],
  cosmos: ['#4a4ae8', '#7b7bff'],
  ocean:  ['#00b4d8', '#66e0ff']
};

const RING_PARTICLES = { high: 600, medium: 350, low: 180 };
const RING_COUNT = { high: 3, medium: 2, low: 1 };

let rings = [];
let currentTheme = 'fluid';
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;
let scrollProgress = 0;
let tickFn = null;

export function initHero3D() {
  const scene = getScene();
  if (!scene) return;

  const tier = getPerfTier();
  const particlesPerRing = RING_PARTICLES[tier];
  const ringCount = RING_COUNT[tier];

  const accentColor = new THREE.Color('#e94560');
  const glowColor = new THREE.Color('#ff6b8a');

  for (let r = 0; r < ringCount; r++) {
    const positions = new Float32Array(particlesPerRing * 3);
    const sizes = new Float32Array(particlesPerRing);

    // 环半径和倾斜角度
    const baseRadius = 1.8 + r * 0.6;
    const tiltX = (r - 1) * Math.PI * 0.3;

    for (let i = 0; i < particlesPerRing; i++) {
      const i3 = i * 3;
      const angle = (i / particlesPerRing) * Math.PI * 2;
      // 添加小幅度随机偏移让环更自然
      const radius = baseRadius + (Math.random() - 0.5) * 0.3;

      // 基础环位置（在 XZ 平面）
      let x = Math.cos(angle) * radius;
      let y = (Math.random() - 0.5) * 0.25; // 微小厚度
      let z = Math.sin(angle) * radius;

      // 绕 X 轴倾斜
      const cosX = Math.cos(tiltX);
      const sinX = Math.sin(tiltX);
      const y2 = y * cosX - z * sinX;
      const z2 = y * sinX + z * cosX;

      positions[i3] = x;
      positions[i3 + 1] = y2;
      positions[i3 + 2] = z2 - 2; // 推到相机后方

      sizes[i] = Math.random() * 1.8 + 0.4;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mixColor = accentColor.clone().lerp(glowColor, r / ringCount);
    const material = new THREE.PointsMaterial({
      size: 0.04,
      color: mixColor,
      transparent: true,
      opacity: 0.7 - r * 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const ring = new THREE.Points(geometry, material);
    ring.userData = {
      baseRotX: tiltX,
      baseRotY: r * 0.8,
      rotSpeed: 0.1 + r * 0.08,
      parallaxFactor: 0.03 + r * 0.01,
      index: r
    };

    scene.add(ring);
    rings.push(ring);
  }

  document.addEventListener('mousemove', onMouseMove);

  tickFn = (time) => {
    mouseX += (targetMouseX - mouseX) * 0.04;
    mouseY += (targetMouseY - mouseY) * 0.04;

    // 滚动进度
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = h > 0 ? window.scrollY / h : 0;
    scrollProgress += (targetScroll - scrollProgress) * 0.05;

    rings.forEach((ring) => {
      const { baseRotX, baseRotY, rotSpeed, parallaxFactor } = ring.userData;

      // 基础旋转
      ring.rotation.y += rotSpeed * 0.005;
      ring.rotation.x += Math.sin(time * 0.3) * 0.002;

      // 鼠标视差
      ring.rotation.y += mouseX * parallaxFactor * 0.5;
      ring.rotation.x += mouseY * parallaxFactor * 0.3;

      // 滚动：环随滚动向下移动并缩小透明度
      ring.position.y = -scrollProgress * 3;
      ring.material.opacity = Math.max(0, 0.7 - ring.userData.index * 0.15 - scrollProgress * 0.6);
    });
  };
  addRenderCallback(tickFn);
}

export function switchHeroTheme(theme) {
  if (!themeColors[theme]) return;
  currentTheme = theme;

  const [c1, c2] = themeColors[theme];
  const color1 = new THREE.Color(c1);
  const color2 = new THREE.Color(c2);

  rings.forEach((ring, i) => {
    const mixColor = color1.clone().lerp(color2, i / rings.length);
    ring.material.color.copy(mixColor);
  });
}

export function disposeHero3D() {
  if (tickFn) removeRenderCallback(tickFn);
  document.removeEventListener('mousemove', onMouseMove);

  rings.forEach((ring) => {
    ring.geometry.dispose();
    ring.material.dispose();
    ring.parent?.remove(ring);
  });
  rings = [];
}

function onMouseMove(e) {
  targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
  targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
}
