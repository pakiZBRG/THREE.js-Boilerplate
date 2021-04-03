import '../style.scss'
import * as dat from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Debug
 */
const gui = new dat.GUI({width: 400});
const cameraPosition = gui.addFolder("Camera Position")
const cubeScale = gui.addFolder("Cube Scale")
const door = gui.addFolder('Door');
const param = {
    color: 0xff0000
}

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
 * Textures
 */
const texture = new THREE.TextureLoader();
const cubeTexture = new THREE.CubeTextureLoader();

const doorColor = texture.load('/static/door/color.jpg');
const doorAlpha = texture.load('/static/door/alpha.jpg');
const doorAmbientOcclusion = texture.load('/static/door/ambientOcclusion.jpg');
const doorHeight = texture.load('/static/door/height.jpg');
const doorNormal = texture.load('/static/door/normal.jpg');
const doorMetalness = texture.load('/static/door/metalness.jpg');
const doorRoughness = texture.load('/static/door/roughness.jpg');
const matcapTexture = texture.load('/static/matcaps/4.png');
const environmentMap = cubeTexture.load([
    '/static/environmentMaps/4/px.png',
    '/static/environmentMaps/4/nx.png',
    '/static/environmentMaps/4/py.png',
    '/static/environmentMaps/4/ny.png',
    '/static/environmentMaps/4/pz.png',
    '/static/environmentMaps/4/nz.png'
])

/**
 * Geometry, Material
 */
const geometry = new THREE.PlaneBufferGeometry(1, 1, 100, 100);
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.3;
material.metalness = 0;
material.map = doorColor;
material.aoMap = doorAmbientOcclusion;
material.metalnessMap = doorMetalness;
material.roughnessMap = doorRoughness;
material.displacementMap = doorHeight;
material.displacementScale = 0.1;
material.normalMap = doorNormal;
material.normalScale.set(2, 2, 2);
material.transparent = true;
material.alphaMap = doorAlpha;

// const material = new THREE.MeshStandardMaterial();
// material.roughness = 0;
// material.metalness = 1;
// material.envMap = environmentMap;

/**
 * Adding mesh to scene
 */
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 3;
camera.lookAt(cube.position);
scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enablePan = false;
controls.rotateSpeed = .8;
controls.enableDamping = true;

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, .5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, .5);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

/**
 * Debugging
 */
gui.addColor(param, 'color').onChange(() => material.color.set(param.color));
cameraPosition.add(cube.position, 'x', -3, 3, 0.01).name('positionX');
cameraPosition.add(cube.position, 'y', -3, 3, 0.01).name('positionY');
cameraPosition.add(cube.position, 'z', -3, 3, 0.01).name('positionZ');
cubeScale.add(cube.scale, 'x', 0, 3, 0.01).name('scaleX');
cubeScale.add(cube.scale, 'y', 0, 3, 0.01).name('scaleY');
cubeScale.add(cube.scale, 'z', 0, 3, 0.01).name('scaleZ');
door.add(material, "roughness", 0, 1, .01);
door.add(material, "metalness", 0, 1, .01);
door.add(material, 'displacementScale', 0, 1, .01);
gui.add(controls, 'autoRotate');

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