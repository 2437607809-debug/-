import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { getScene, getCamera, getRenderer, getPerfTier } from './scene.js';

let composer;
let bloomPass;

export function initPostProcessing() {
  const renderer = getRenderer();
  const scene = getScene();
  const camera = getCamera();
  if (!renderer || !scene || !camera) return;

  const size = new THREE.Vector2(window.innerWidth, window.innerHeight);

  composer = new EffectComposer(renderer);

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // 移动端低配削弱 bloom
  const isLow = getPerfTier() === 'low';
  bloomPass = new UnrealBloomPass(size, isLow ? 0.3 : 0.6, isLow ? 0.3 : 0.5, 0.7);
  composer.addPass(bloomPass);

  window.addEventListener('resize', onResize);
}

export function render(timestamp) {
  if (composer) {
    composer.render();
  }
}

export function setBloomStrength(v) {
  if (bloomPass) bloomPass.strength = v;
}

export function disposePostProcessing() {
  window.removeEventListener('resize', onResize);
  if (bloomPass) {
    bloomPass.dispose();
    bloomPass = null;
  }
  if (composer) {
    composer.dispose?.();
    composer = null;
  }
}

function onResize() {
  if (composer) {
    composer.setSize(window.innerWidth, window.innerHeight);
  }
}
