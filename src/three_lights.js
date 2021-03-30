import './style.scss'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

/**
 * Canvas
 */
const canvas = document.querySelector('.webgl');

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
// const ambientLight = new THREE.AmbientLight(0xffffff, .5);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xcc1fb5, .3);
// directionalLight.position.set(0, 1, 0.8);
// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, .2);
// scene.add(directionalLight, directionalLightHelper);

// const hemisphereLight = new THREE.HemisphereLight(0x168f48, 0x6c1290, .4);
// const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, .4);
// scene.add(hemisphereLight, hemisphereLightHelper);

// const pointLight = new THREE.PointLight(0x0c6580, .5, 2, 1);
// pointLight.position.set(-1, 0, 1);
// const pointLightHelper = new THREE.PointLightHelper(pointLight, .4);
// scene.add(pointLight, pointLightHelper);

// const rectAreaLight = new THREE.RectAreaLight(0x800c0c, 5, 2, 1);
// const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
// rectAreaLight.position.set(-1.5, 0, 1.5);
// rectAreaLight.lookAt(new THREE.Vector3());
// scene.add(rectAreaLight, rectAreaLightHelper);

const spotlight = new THREE.SpotLight(0xc8ca59, .5, 6, Math.PI * .1, .1, .5);
spotlight.position.set(0, 2, 3);
const spotlightHelper = new THREE.SpotLightHelper(spotlight);
scene.add(spotlight, spotlightHelper, spotlight.target);
spotlight.target.position.x = -1;

window.requestAnimationFrame(() => spotlightHelper.update());


/**
 * Objects
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const torus = new THREE.Mesh(new THREE.TorusBufferGeometry(.3, .2, 25, 50), material);

const cube = new THREE.Mesh(new THREE.BoxBufferGeometry(.75, .75, .75), material);
cube.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

/**
 * Adding mesh to scene
 */
scene.add(sphere, torus, cube, plane);


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

/**
 * Animations
 */
const tick = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();