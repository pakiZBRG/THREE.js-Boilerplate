import './style.scss'
import * as dat from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Debug
 */
const gui = new dat.GUI({width: 400});
const cameraPosition = gui.addFolder("Camera Position")
const cubeScale = gui.addFolder("Cube Scale")
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
 * Geometry, Material
 */
const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: param.color });

/**
 * Adding mesh to scene
 */
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);


/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enablePan = false;
controls.rotateSpeed = .8;
controls.enableDamping = true;

/**
 * Debugging
 */
gui.addColor(param, 'color').onChange(() => material.color.set(param.color));
cameraPosition.add(mesh.position, 'x', -3, 3, 0.01).name('positionX');
cameraPosition.add(mesh.position, 'y', -3, 3, 0.01).name('positionY');
cameraPosition.add(mesh.position, 'z', -3, 3, 0.01).name('positionZ');
cubeScale.add(mesh.scale, 'x', 0, 3, 0.01).name('scaleX');
cubeScale.add(mesh.scale, 'y', 0, 3, 0.01).name('scaleY');
cubeScale.add(mesh.scale, 'z', 0, 3, 0.01).name('scaleZ');
gui.add(controls, 'autoRotate');
gui.add(material, 'wireframe');

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