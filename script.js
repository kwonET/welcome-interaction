// import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
// // import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"; // 이렇게 변경합니다.
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import * as dat from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
} from "postprocessing";
THREE.ColorManagement.enabled = false;

let addedInput = 0;
// 웹 소켓 연결
const socket = new WebSocket("ws://192.168.0.8:81");
socket.onmessage = function (event) {
  console.log(event.data);
  // const inputButton = event.data;
  // addedInput += Number(inputButton);
};
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
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

scene.background = new THREE.Color(0x06101f); // Replace 0xabcdef with the color hex value you desire
// const texturesLoader = new THREE.TextureLoader();
// const texture = texturesLoader.load("layer1.png");
// scene.background = texture;
/**
 * Floor
 */
const floor = new THREE.SphereGeometry(130, 100, 100);

const floorMaterial = new THREE.MeshStandardMaterial({
  map: new THREE.TextureLoader().load("/floor2.png"),
});
const floorM = new THREE.Mesh(floor, floorMaterial);
floorM.receiveShadow = true;
floorM.rotation.x = -Math.PI * 0.5;
floorM.rotation.z = Math.PI * 0.75;
scene.add(floorM);
floorM.position.set(0, -130, 0);

//rabbit
let modelrabbit = null;
let mixerR;
gltfLoader.load("/models/models1105/strangerabbit.gltf", (rabbit) => {
  modelrabbit = rabbit;
  rabbit.scene.scale.set(2.5, 2.5, 2.5);
  rabbit.scene.position.set(-5, 0, 8);
  rabbit.scene.rotation.set(0, -1, 0);
  scene.add(rabbit.scene);
  mixerR = new THREE.AnimationMixer(rabbit.scene);
  const rabbitAction = mixerR.clipAction(rabbit.animations[0]);
  rabbitAction.play();
});

//dandelion
let mixerD = null;
let modelDandelion = null;
gltfLoader.load("/models/models1105/dandelion.gltf", (dandelion) => {
  modelDandelion = dandelion;
  dandelion.scene.scale.set(2.4, 2.4, 2.4);
  dandelion.scene.rotation.set(0, -1, 0);
  dandelion.scene.position.set(-5, -2, -25);

  scene.add(dandelion.scene);
  mixerD = new THREE.AnimationMixer(dandelion.scene);
  const dandelionAction = mixerD.clipAction(dandelion.animations[0]);
  dandelionAction.play();
});

//purplemonster
let mixerP = null;
let modelPMonster = null;
gltfLoader.load("/models/models1105/PurpleMonster.gltf", (purpleMonster) => {
  modelPMonster = purpleMonster;
  purpleMonster.scene.scale.set(0.8, 0.8, 0.8);
  purpleMonster.scene.rotation.set(0, -0.6, 0);
  purpleMonster.scene.position.set(-7.5, 5, -15);

  scene.add(purpleMonster.scene);
  mixerP = new THREE.AnimationMixer(purpleMonster.scene);
  const purpleMonsterAction = mixerP.clipAction(purpleMonster.animations[0]);
  purpleMonsterAction.play();
});

//walking sign
let mixerW = null;
let modelWS = null;
gltfLoader.load("/models/models1105/walkingsign.gltf", (walkingsign) => {
  modelWS = walkingsign;
  walkingsign.scene.scale.set(1.5, 1.5, 1.5);
  walkingsign.scene.rotation.set(0, -3, 0);
  walkingsign.scene.position.set(29, 0, -28.5);

  scene.add(walkingsign.scene);
  mixerW = new THREE.AnimationMixer(walkingsign.scene);
  const walkingsignAction = mixerW.clipAction(walkingsign.animations[0]);
  walkingsignAction.play();
});

//human
let modelHuman = null;
let mixerH = null;
gltfLoader.load("/models/models1105/humanfix.gltf", (human) => {
  modelHuman = human;
  human.scene.position.set(15, 0, 15);
  human.scene.rotation.set(0, -1, 0);
  human.scene.scale.set(0.6, 0.6, 0.6);

  scene.add(human.scene);
  mixerH = new THREE.AnimationMixer(human.scene);
  const humanAction = mixerH.clipAction(human.animations[0]);
  humanAction.play();
});

//wolf
let mixerWolf = null;
gltfLoader.load("/models/model1122/Wolf.gltf", (wolf) => {
  wolf.scene.position.set(30, 0, 15);
  wolf.scene.rotation.set(0, -1, 0);
  wolf.scene.scale.set(0.45, 0.45, 0.45);

  scene.add(wolf.scene);
  mixerWolf = new THREE.AnimationMixer(wolf.scene);
  const wolfAction = mixerWolf.clipAction(wolf.animations[0]);
  wolfAction.play();
});

//witch
let mixerWitch = null;
gltfLoader.load("/models/model1122/witch.gltf", (witch) => {
  witch.scene.position.set(25, -2, -35);
  witch.scene.rotation.set(0, -4, 0);
  witch.scene.scale.set(1.8, 1.8, 1.8);

  scene.add(witch.scene);
  mixerWitch = new THREE.AnimationMixer(witch.scene);
  const witchAction = mixerWitch.clipAction(witch.animations[0]);
  witchAction.play();
});

//triangle
let mixerTriangle = null;
gltfLoader.load("/models/model1122/Triangle.gltf", (triangle) => {
  triangle.scene.position.set(5, -2, -45);
  triangle.scene.rotation.set(0, 1, 0);
  triangle.scene.scale.set(1.2, 1.2, 1.2);

  scene.add(triangle.scene);
  mixerTriangle = new THREE.AnimationMixer(triangle.scene);
  const triangleAction = mixerTriangle.clipAction(triangle.animations[0]);
  triangleAction.play();
});
//leaf
let mixerLeaf = null;
gltfLoader.load("/models/model1122/leaf.gltf", (leaf) => {
  leaf.scene.position.set(25, 0, -15);
  leaf.scene.rotation.set(0, 2, 0);
  leaf.scene.scale.set(1.4, 1.4, 1.4);

  scene.add(leaf.scene);
  mixerLeaf = new THREE.AnimationMixer(leaf.scene);
  const leafAction = mixerLeaf.clipAction(leaf.animations[0]);
  leafAction.play();
});
//leaf2
let mixerLeaf2 = null;
gltfLoader.load("/models/model1122/leaf.gltf", (leaf2) => {
  leaf2.scene.position.set(5, 0, 15);
  leaf2.scene.rotation.set(0, 2, 0);
  leaf2.scene.scale.set(1.6, 1.6, 1.6);

  scene.add(leaf2.scene);
  mixerLeaf2 = new THREE.AnimationMixer(leaf2.scene);
  const leafAction2 = mixerLeaf2.clipAction(leaf2.animations[0]);
  leafAction2.play();
});
//cat
let mixerCat = null;
gltfLoader.load("/models/model1122/cat.gltf", (cat) => {
  cat.scene.position.set(15, 5, -10);
  cat.scene.rotation.set(0, 0, 0);
  cat.scene.scale.set(2.2, 2.2, 2.2);

  scene.add(cat.scene);
  mixerCat = new THREE.AnimationMixer(cat.scene);
  const catAction = mixerCat.clipAction(cat.animations[0]);
  catAction.play();
});
//boat
let mixerBoat = null;
gltfLoader.load("/models/model1122/boat.gltf", (boat) => {
  boat.scene.position.set(39, 0, -5);
  boat.scene.rotation.set(0, 1.5, 0);
  boat.scene.scale.set(1.3, 1.3, 1.3);

  scene.add(boat.scene);
  mixerBoat = new THREE.AnimationMixer(boat.scene);
  const boatAction = mixerBoat.clipAction(boat.animations[0]);
  boatAction.play();
});

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/texture/matcaps/50.png");

/**
 * Fonts
 */
const fontLoader = new FontLoader();
let text;
fontLoader.load("/font/ahn2006-B_Regular.json", (font) => {
  const textGeometry = new TextGeometry("신중한 무법지대 미친 안전지대", {
    font: font,
    size: 5,
    height: 3,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  textGeometry.center();

  const textMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
  });
  text = new THREE.Mesh(textGeometry, textMaterial);
  text.position.set(0, 20, 0);
  text.scale.set(0, 0, 0);
  text.rotation.set(0, -4.2, 0);
});

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

const defaultFov = 60;
const camera = new THREE.PerspectiveCamera(
  defaultFov, //40
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(60, 30, -40); //z축 중심, x축 중심, y축 중심으로 회전,
scene.add(camera);

/**
 * Lights
 */
const light2 = new THREE.AmbientLight(0xebff82, 0.5);
scene.add(light2); // Set light position to camera position
const light = new THREE.AmbientLight(0xa374db, 0.5);
scene.add(light); // Set light position to camera position

const spotLightYellow = new THREE.SpotLight(0xebff82, 35, 105, 3);
spotLightYellow.position.set(0, 0, -35);
scene.add(spotLightYellow);
const spotLightPurple = new THREE.SpotLight(0xa374db, 35, 105, 3);
spotLightPurple.position.set(30, 0, -10);
scene.add(spotLightPurple);
const spotLightYellow2 = new THREE.SpotLight(0xebff82, 25, 105, 3);
spotLightYellow2.position.set(-30, 0, -35);
scene.add(spotLightYellow2);
const spotLightPurple2 = new THREE.SpotLight(0xa374db, 35, 105, 3);
spotLightPurple2.position.set(40, 0, 10);
scene.add(spotLightPurple2);
const spotLightYellow3 = new THREE.SpotLight(0xebff82, 15, 105, 3);
spotLightYellow3.position.set(35, 0, 15);
scene.add(spotLightYellow3);
const spotLightPurple3 = new THREE.SpotLight(0xa374db, 35, 105, 3);
spotLightPurple3.position.set(30, 0, 25);
scene.add(spotLightPurple3);

// Rabbit
const spotLight = new THREE.SpotLight(0xb5fc6d, 30, 15, 10);
spotLight.position.set(-5, -10, 15);
scene.add(spotLight);
const spotLightAbove = new THREE.SpotLight(0xf4ebff, 50, 15, 10);
spotLightAbove.position.set(-5, -10, 13);
scene.add(spotLightAbove);
const spotLightSide = new THREE.SpotLight(0xf4ebff, 50, 15, 10);
spotLightSide.position.set(-3, -10, 11);
scene.add(spotLightSide);

// Dandelion
const spotLightD = new THREE.SpotLight(0xb5fc6d, 30, 15, 10);
spotLightD.position.set(-5, -10, 15);
scene.add(spotLightD);
const spotLightAboveD = new THREE.SpotLight(0xf4ebff, 50, 15, 10);
spotLightAboveD.position.set(-5, -10, 13);
scene.add(spotLightAboveD);
const spotLightSideD = new THREE.SpotLight(0xf4ebff, 50, 15, 10);
spotLightSideD.position.set(-3, -10, 11);
scene.add(spotLightSideD);

// purplemonster
const spotLightP = new THREE.SpotLight(0xb5fc6d, 30, 15, 10);
spotLightP.position.set(-5, -10, 15);
scene.add(spotLightP);
const spotLightAboveP = new THREE.SpotLight(0xf4ebff, 50, 15, 10);
spotLightAboveP.position.set(-5, -10, 13);
scene.add(spotLightAboveP);
const spotLightSideP = new THREE.SpotLight(0xf4ebff, 50, 15, 10);
spotLightSideP.position.set(-3, -10, 11);
scene.add(spotLightSideP);

// human
const spotLightH = new THREE.SpotLight(0xb5fc6d, 30, 15, 10);
spotLightH.position.set(-5, -10, 15);
scene.add(spotLightH);
const spotLightAboveH = new THREE.SpotLight(0xf4ebff, 50, 15, 10);
spotLightAboveH.position.set(-5, -10, 13);
scene.add(spotLightAboveH);
const spotLightSideH = new THREE.SpotLight(0xf4ebff, 50, 15, 10);
spotLightSideH.position.set(-3, -10, 11);
scene.add(spotLightSideH);

// walking sign
const spotLightW = new THREE.SpotLight(0xb5fc6d, 30, 15, 10);
spotLightW.position.set(-5, -10, 15);
scene.add(spotLightW);
const spotLightAboveW = new THREE.SpotLight(0xf4ebff, 50, 15, 10);
spotLightAboveW.position.set(-5, -10, 13);
scene.add(spotLightAboveW);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

/**
 * Sound
 */
// AudioLoader 생성
var audioLoader = new THREE.AudioLoader();
// AudioListener 생성
var listener = new THREE.AudioListener();
// Audio 객체 생성 및 로드
//dandelion
let soundD = new THREE.Audio(listener);
audioLoader.load("/sound/dandelion.mp3", function (buffer) {
  soundD.setBuffer(buffer);
  soundD.setLoop(false);
  soundD.setVolume(1.2);
});
//human
let soundH = new THREE.Audio(listener);
audioLoader.load("/sound/human.mp3", function (buffer) {
  soundH.setBuffer(buffer);
  soundH.setLoop(false);
  soundH.setVolume(0.8);
});
//purplemonster
let soundP = new THREE.Audio(listener);
audioLoader.load("/sound/purple.wav", function (buffer) {
  soundP.setBuffer(buffer);
  soundP.setLoop(false);
  soundP.setVolume(0.1);
});
//rabbit
let soundR = new THREE.Audio(listener);
audioLoader.load("/sound/rabbit.wav", function (buffer) {
  soundR.setBuffer(buffer);
  soundR.setLoop(false);
  soundR.setVolume(0.1);
});
//walking
let soundW = new THREE.Audio(listener);
audioLoader.load("/sound/walking.wav", function (buffer) {
  soundW.setBuffer(buffer);
  soundW.setLoop(false);
  soundW.setVolume(0.5);
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

let composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const effectPass = new EffectPass(camera, new BloomEffect());
effectPass.renderToScreen = true;
composer.addPass(effectPass);

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;
let weightInput = 0;
let weight = 0;
let cntR = 0;
let cntD = 0;
let cntP = 0;
let cntH = 0;
let cntW = 0;
let previousInput = 0;
const tick = () => {
  // inputButton = event.data;
  // addedInput += inputButton;
  const presentInput = addedInput;
  const deltaInput = presentInput - previousInput;
  previousInput = presentInput;
  weightInput += deltaInput;
  console.log(weightInput);

  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  weight += deltaTime;
  console.log(cntP);
  if (cntR > 53) {
    scene.add(text); // Use GSAP to animate the scale property for a smooth transition
    gsap.to(text.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 2, // Animation duration in seconds
      ease: "elastic.out(1, 0.5)", // Easing function for a bounce effect
      onComplete: function () {
        // Animation completed, now let's fade out
        gsap.to(text.material, {
          opacity: 0,
          duration: 0.5, // You can adjust the duration for the fade-out
          onComplete: function () {
            // Animation completed, now remove the text from the scene
            scene.remove(text);
          },
        });
      },
    });
    cntR = 0;
  }
  if (cntD > 47) {
    scene.add(text); // Use GSAP to animate the scale property for a smooth transition
    gsap.to(text.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 2, // Animation duration in seconds
      ease: "elastic.out(1, 0.5)", // Easing function for a bounce effect
      onComplete: function () {
        // Animation completed, now let's fade out
        gsap.to(text.material, {
          opacity: 0,
          duration: 0.5, // You can adjust the duration for the fade-out
          onComplete: function () {
            // Animation completed, now remove the text from the scene
            scene.remove(text);
          },
        });
      },
    });
    cntD = 0;
  }
  if (cntH > 60) {
    scene.add(text); // Use GSAP to animate the scale property for a smooth transition
    gsap.to(text.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 2, // Animation duration in seconds
      ease: "elastic.out(1, 0.5)", // Easing function for a bounce effect
      onComplete: function () {
        // Animation completed, now let's fade out
        gsap.to(text.material, {
          opacity: 0,
          duration: 0.5, // You can adjust the duration for the fade-out
          onComplete: function () {
            // Animation completed, now remove the text from the scene
            scene.remove(text);
          },
        });
      },
    });
    cntH = 0;
  }
  if (cntP > 58) {
    scene.add(text); // Use GSAP to animate the scale property for a smooth transition
    gsap.to(text.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 2, // Animation duration in seconds
      ease: "elastic.out(1, 0.5)", // Easing function for a bounce effect
      onComplete: function () {
        // Animation completed, now let's fade out
        gsap.to(text.material, {
          opacity: 0,
          duration: 0.5, // You can adjust the duration for the fade-out
          onComplete: function () {
            // Animation completed, now remove the text from the scene
            scene.remove(text);
          },
        });
      },
    });
    cntP = 0;
  }
  if (cntW > 55) {
    scene.add(text); // Use GSAP to animate the scale property for a smooth transition
    gsap.to(text.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 2, // Animation duration in seconds
      ease: "elastic.out(1, 0.5)", // Easing function for a bounce effect
      onComplete: function () {
        // Animation completed, now let's fade out
        gsap.to(text.material, {
          opacity: 0,
          duration: 0.5, // You can adjust the duration for the fade-out
          onComplete: function () {
            // Animation completed, now remove the text from the scene
            scene.remove(text);
          },
        });
      },
    });
    cntW = 0;
  }
  // Model animation
  if (mixerWolf) {
    mixerWolf.update(deltaTime);
  }
  if (mixerWitch) {
    mixerWitch.update(deltaTime);
  }
  if (mixerR) {
    mixerR.update(deltaTime);
  }
  if (mixerD) {
    mixerD.update(deltaTime);
  }
  if (mixerTriangle) {
    mixerTriangle.update(deltaTime);
  }
  if (mixerLeaf) {
    mixerLeaf.update(deltaTime);
  }
  if (mixerLeaf2) {
    mixerLeaf2.update(deltaTime);
  }
  if (mixerCat) {
    mixerCat.update(deltaTime);
  }
  if (mixerBoat) {
    mixerBoat.update(deltaTime);
  }
  if (mixerP) {
    mixerP.update(deltaTime);
  }
  if (mixerW) {
    mixerW.update(deltaTime);
  }
  if (mixerH) {
    mixerH.update(deltaTime);
  }
  document.onkeydown = function (e) {
    switch (e.keyCode) {
      case 37: //left
        if (mixerR) {
          modelrabbit.scene.position.set(-5 + cntR, 0, 8);
          spotLight.position.set(-5 + cntR, 0, 8); // Set light position
          spotLightAbove.position.set(-5 + cntR, 10, 6); // Set light position
          spotLightSide.position.set(-3 + cntR, 8, 4);
          if (soundR.isPlaying) {
            // 이미 재생 중이면 중지하고 다시 시작
            soundR.stop();
          }
          soundR.play();
          cntR += 1;
          mixerR.update(deltaTime);
        }
        break;

      case 38: // up
        if (mixerD) {
          modelDandelion.scene.position.set(-5 + cntD, 0, -25);
          spotLightD.position.set(cntD, 0, -25); // Set light position
          spotLightAboveD.position.set(10 + cntD, 5, -31); // Set light position
          spotLightSideD.position.set(-5 + cntD, 12, -27);
          if (soundD.isPlaying) {
            // 이미 재생 중이면 중지하고 다시 시작
            soundD.stop();
          }
          soundD.play();
          cntD += 1;
          mixerD.update(deltaTime);
        }
        break;
      case 39: // right
        if (mixerP) {
          modelPMonster.scene.position.set(-7.5 + cntP, 5, -15);
          spotLightP.position.set(-7.5 + cntP, 0, -15); // Set light position
          spotLightAboveP.position.set(-1 + cntP, 10, -13); // Set light position
          spotLightSideP.position.set(-3.5 + cntP, 10, -21);
          if (soundP.isPlaying) {
            // 이미 재생 중이면 중지하고 다시 시작
            soundP.stop();
          }
          soundP.play();
          cntP += 1;
          mixerP.update(deltaTime);
        }
        break;
      case 40: // down
        if (mixerH) {
          modelHuman.scene.position.set(15 + cntH * 0.01, 0, 15 - cntH);
          spotLightH.position.set(15 + cntH * 0.01, 0, 15 - cntH); // Set light position
          spotLightAboveH.position.set(15 + cntH * 0.01, 10, 15 - cntH); // Set light position
          // spotLightSideP.position.set(-3.5 + cntP, 10, -21);
          if (soundH.isPlaying) {
            // 이미 재생 중이면 중지하고 다시 시작
            soundH.stop();
          }
          soundH.play();
          cntH += 1;
          mixerH.update(deltaTime);
        }
        break;
      case 13: // enter
        if (mixerW) {
          modelWS.scene.position.set(29 - cntW * 0.03, 0, -28.5 + cntW);
          spotLightW.position.set(29 - cntW * 0.02, 4, -30 + cntW); // Set light position
          spotLightAboveW.position.set(29 - cntW * 0.02, 10, -31 + cntW); // Set light position

          if (soundW.isPlaying) {
            // 이미 재생 중이면 중지하고 다시 시작
            soundW.stop();
          }
          soundW.play();
          cntW += 1;
          mixerW.update(deltaTime);
        }
        break;
    }
  };

  // if (deltaInput == 1) {
  //   if (mixerR) {
  //     modelrabbit.scene.position.set(-5 + cntR, 0, 8);
  //     spotLight.position.set(-5 + cntR, 0, 8); // Set light position
  //     spotLightAbove.position.set(-5 + cntR, 10, 6); // Set light position
  //     spotLightSide.position.set(-3 + cntR, 8, 4);
  //     cntR += 1;
  //     mixerR.update(deltaTime);
  //   }
  // }

  // if (mixerD) {
  //   modelDandelion.scene.position.set(-5 + cntD, 0, -25);
  //   spotLightD.position.set(-5 + cntD, 0, -25); // Set light position
  //   spotLightAboveD.position.set(-5 + cntD, -5, -25); // Set light position
  //   spotLightSideD.position.set(-5 + cntD, 12, -27);
  //   cntD += 1;
  //   mixerD.update(deltaTime);
  // }

  // if (mixerP) {
  //   modelPMonster.scene.position.set(-7.5 + cntP, 5, -15);
  //   spotLightP.position.set(-7.5 + cntP, 5, -15); // Set light position
  //   spotLightAboveP.position.set(-7.5 + cntP, 7, -17); // Set light position
  //   // spotLightSideP.position.set(-7.5 + cntP, 1, -13);
  //   cntP += 1;
  //   mixerP.update(deltaTime);
  // }

  // if (mixerP) {
  //   modelPMonster.scene.position.set(
  //     Math.cos(weight) * 15,
  //     weight,
  //     Math.sin(weight) * 15
  //   );
  //   mixerP.update(deltaTime);
  // }

  // if (mixerW) {
  //   modelWS.scene.position.set(35 - weight, -2, -10 + weight * 0.5);
  //   mixerW.update(deltaTime);
  // }
  // if (mixerH) {
  //   if (weight < 25) {
  //     modelHuman.scene.position.set(15 - weight, 0, 15 - weight);
  //   }
  //   mixerH.update(deltaTime);
  // }

  // Update controls
  controls.update();

  // Render
  composer.render();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
