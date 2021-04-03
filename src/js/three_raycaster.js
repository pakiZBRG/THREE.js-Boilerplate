import '../style.scss'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
 * Creating a scene
 */
const scene = new THREE.Scene();

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
);
object3.position.x = 2;

scene.add(object1, object2, object3);

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();

/**
 * Cursor
 */
// Mouse move
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', e => {
    mouse.x = e.clientX / sizes.width * 2 - 1;
    mouse.y = e.clientY / sizes.height * -2 + 1;
})

// Mouse click
let currentIntersects = null;
window.addEventListener('click', () => {
    if(currentIntersects){
        if(currentIntersects.object === object1){
            console.log('Object1')
        } else if(currentIntersects.object === object2){
            console.log('Object2')
        } else if(currentIntersects.object === object3){
            console.log('Object3')
        }
    }
})

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
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Move Objects
    object1.position.y = Math.sin(elapsedTime * .3);
    object2.position.y = Math.sin(elapsedTime * .8);
    object3.position.y = Math.sin(elapsedTime * 1.3);

    // Cat a ray
    raycaster.setFromCamera(mouse, camera);

    const objects = [object1, object2, object3];
    const intersects = raycaster.intersectObjects(objects);

    // it doesn't intersect with ray
    for(const o of objects){
        o.material.color.set('#ff0000');
    }

    // it intersects with ray
    for(const i of intersects){
        i.object.material.color.set('#0000ff');
    }

    if(intersects.length){
        if(currentIntersects === null) {
            currentIntersects = intersects[0];
            currentIntersects.object.scale.x = 1.2;
        }
    } else {
        if(currentIntersects !== null) {
            currentIntersects.object.scale.x = 1;
        }
        currentIntersects = null;
    }

    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();