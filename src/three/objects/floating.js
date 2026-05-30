import * as THREE from 'three';
import { getScene, getPerfTier, addRenderCallback, removeRenderCallback } from '../scene.js';

// 几何体配置：类型、大小、位置、旋转速度、视差灵敏度
const OBJECT_DEFS = [
  { type: 'icosahedron', size: 0.35, pos: [-2.8, 1.6, -2], rotSpeed: [0.15, 0.2, 0.1], parallax: 0.025 },
  { type: 'torus',       size: 0.4,  pos: [2.5, -1.4, -3], rotSpeed: [0.1, 0.3, 0.15], parallax: 0.018 },
  { type: 'octahedron',  size: 0.25, pos: [-1.5, -1.2, -1.5], rotSpeed: [0.2, 0.1, 0.25], parallax: 0.03 },
  { type: 'torusKnot',   size: 0.3,  pos: [2.0, 1.8, -3.5], rotSpeed: [0.08, 0.25, 0.12], parallax: 0.012 },
  { type: 'icosahedron', size: 0.2,  pos: [-2.0, -0.5, -4], rotSpeed: [0.12, 0.18, 0.08], parallax: 0.01 },
];

const themeColors = {
  fluid:  ['#e94560', '#0f3460'],
  cosmos: ['#4a4ae8', '#1a1a4e'],
  ocean:  ['#00b4d8', '#0077b6']
};

let objects = [];
let currentTheme = 'fluid';
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;
let tickFn = null;

export function initFloatingObjects() {
  const scene = getScene();
  if (!scene) return;

  // 移动端减少几何体
  const defs = getPerfTier() === 'low'
    ? OBJECT_DEFS.slice(0, 2)
    : getPerfTier() === 'medium'
      ? OBJECT_DEFS.slice(0, 3)
      : OBJECT_DEFS;

  const accentColor = new THREE.Color('#e94560');
  const secondaryColor = new THREE.Color('#4a6fa5');

  defs.forEach((def) => {
    let geometry, material;

    switch (def.type) {
      case 'icosahedron':
        geometry = new THREE.IcosahedronGeometry(def.size, 1);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(def.size, def.size * 0.2, 8, 24);
        break;
      case 'octahedron':
        geometry = new THREE.OctahedronGeometry(def.size, 0);
        break;
      case 'torusKnot':
        geometry = new THREE.TorusKnotGeometry(def.size * 0.8, def.size * 0.15, 64, 8, 2, 3);
        break;
      default:
        geometry = new THREE.IcosahedronGeometry(def.size, 1);
    }

    // Wireframe: 使用亮色线段，Bloom 会捕捉到
    const wireframeGeo = new THREE.WireframeGeometry(geometry);
    const mixColor = accentColor.clone().lerp(secondaryColor, Math.random());
    material = new THREE.LineBasicMaterial({
      color: mixColor,
      transparent: true,
      opacity: 0.35 + Math.random() * 0.25,
      depthWrite: false
    });

    const mesh = new THREE.LineSegments(wireframeGeo, material);
    mesh.position.set(...def.pos);
    mesh.userData = {
      basePos: [...def.pos],
      rotSpeed: def.rotSpeed,
      parallax: def.parallax
    };

    scene.add(mesh);
    objects.push(mesh);

    // 释放不再需要的 geometry
    geometry.dispose();
  });

  document.addEventListener('mousemove', onMouseMove);

  tickFn = (time) => {
    mouseX += (targetMouseX - mouseX) * 0.02;
    mouseY += (targetMouseY - mouseY) * 0.02;

    objects.forEach((obj) => {
      const { basePos, rotSpeed, parallax } = obj.userData;

      // 旋转
      obj.rotation.x += rotSpeed[0] * 0.005;
      obj.rotation.y += rotSpeed[1] * 0.005;
      obj.rotation.z += rotSpeed[2] * 0.005;

      // 鼠标视差（距离越近偏移越大）
      obj.position.x = basePos[0] + mouseX * parallax * 20;
      obj.position.y = basePos[1] + mouseY * parallax * 20;
    });
  };
  addRenderCallback(tickFn);
}

export function switchFloatingTheme(theme) {
  if (!themeColors[theme]) return;
  currentTheme = theme;

  const [c1, c2] = themeColors[theme];
  const color1 = new THREE.Color(c1);
  const color2 = new THREE.Color(c2);

  objects.forEach((obj) => {
    const mixColor = color1.clone().lerp(color2, Math.random());
    obj.material.color.copy(mixColor);
  });
}

export function disposeFloatingObjects() {
  if (tickFn) removeRenderCallback(tickFn);
  document.removeEventListener('mousemove', onMouseMove);

  objects.forEach((obj) => {
    obj.geometry.dispose();
    obj.material.dispose();
    obj.parent?.remove(obj);
  });
  objects = [];
}

function onMouseMove(e) {
  targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
  targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
}
