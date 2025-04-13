import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
/**
 * Base
 */
// Debug
const gui = new dat.GUI();
// Canvas
const canvas = document.querySelector("canvas.webgl");
// Scene
const scene = new THREE.Scene();
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/texture/matcaps/5050.png");
/**
 * Fonts
 */
const fontLoader = new FontLoader();
fontLoader.load("/font/ahn2006-B_Regular.json", (font) => {
  const textGeometry = new TextGeometry(
    "환영합니다. 이곳은 신중한 무법지대 미친 안전지대\n",
    {
      font: font,
      size: 8,
      height: 5,
      curveSegments: 5,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4,
    }
  );
  textGeometry.center();

  const textMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
  });
  const text = new THREE.Mesh(textGeometry, textMaterial);
  text.position.set(0, 20, 0);
  text.rotation.set(0, -4.2, 0);
  scene.add(text);
});
// AxesHelper
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper)
/**
 * Object
 */
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial()
);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
/**
 * Camera
 */
// Base camera
const defaultFov = 50;
const camera = new THREE.PerspectiveCamera(
  defaultFov, //40
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(70, 30, -40); //z축 중심, x축 중심, y축 중심으로 회전,
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // Update controls
  controls.update();
  // Render
  renderer.render(scene, camera);
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
tick();
