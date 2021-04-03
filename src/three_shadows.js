import './style.scss'
import * as dat from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Debug
 */
const gui = new dat.GUI({width: 400});

/**
 * Canvas
 */
const canvas = document.querySelector('.webgl');

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg');
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg');

/**
 * Resizing
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

/**
 * Fullscreen
 */
window.addEventListener('dblclick', () => {
    if(!document.fullscreenElement){
        canvas.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
})

/**
 * Get position of cursor
 */
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', e => {
    cursor.x = e.clientX / sizes.width - 0.5;
    cursor.x = e.clientX / sizes.height - 0.5;
});

/**
 * Creating a scene
 */
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, .4);
scene.add(ambientLight);

//Directional light
// const directionalLight = new THREE.DirectionalLight(0xffffff, .3);
// directionalLight.position.set(2, 2, -1);
// scene.add(directionalLight);

// directionalLight.castShadow = true;
// directionalLight.shadow.mapSize.height = 1024;
// directionalLight.shadow.mapSize.width = 1024;
// directionalLight.shadow.camera.top = 2;
// directionalLight.shadow.camera.right = 2;
// directionalLight.shadow.camera.left = -2;
// directionalLight.shadow.camera.bottom = -2;
// directionalLight.shadow.camera.near = 1;
// directionalLight.shadow.camera.far = 6;

// const directionalLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(directionalLightHelper);

// SpotLight
// const spotlight = new THREE.SpotLight(0xffffff, .3, 10, Math.PI * .3);
// scene.add(spotlight, spotlight.target);
// spotlight.position.set(0, 2, 2);

// spotlight.castShadow = true;
// spotlight.shadow.mapSize.height = 1024;
// spotlight.shadow.mapSize.width = 1024;
// spotlight.shadow.camera.fov = 30;
// spotlight.shadow.camera.near = 1;
// spotlight.shadow.camera.far = 5.5;

// const spotlightHelper = new THREE.CameraHelper(spotlight.shadow.camera);
// scene.add(spotlightHelper);

// Point Light
// const pointLight = new THREE.PointLight(0xdd00dd, .3);
// scene.add(pointLight);
// pointLight.position.set(-1, 1, 1);

// pointLight.castShadow = true;
// pointLight.shadow.mapSize.height = 1024;
// pointLight.shadow.mapSize.width = 1024;
// pointLight.shadow.camera.near = 1;
// pointLight.shadow.camera.far = 5.5;

// const pointLightHelper = new THREE.CameraHelper(pointLight.shadow.camera);
// scene.add(pointLightHelper);

/**
 * Material
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, 'roughness', 0, 1, 0.01);
gui.add(material, 'metalness', 0, 1, 0.01);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(.5, 32, 32), material);
sphere.castShadow = true;

const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(5, 5), material);
plane.receiveShadow = true;
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;

/**
 * Adding mesh to scene
 */
scene.add(sphere, plane);

//Backed Shadow
const sphereShadow = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow
    })
);
sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.01;
scene.add(sphereShadow);


/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 3;
scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enablePan = false;
controls.rotateSpeed = .8;
controls.enableDamping = true;

/**
 * Rendering scene and camera
 */
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

/**
 * Animations
 */
const tick = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();