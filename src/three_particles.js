import './style.scss'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Canvas
 */
const canvas = document.querySelector('.webgl');

/**
 * Creating a scene
 */
 const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('/particles/3.png');

/**
 * Particles
 */
// Geometry
const particleGeometry = new THREE.BufferGeometry();
const count = 100000;

// vertices (x, y, z)
const positions = new Float32Array(count * 3);
// colors (r, g, b)
const colors = new Float32Array(count * 3);

for(let i = 0; i < count*3; i++){
    positions[i] = (Math.random() - 0.5) * 5;
    colors[i] = Math.random();
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

//Material
const particleMaterial = new THREE.PointsMaterial({
    // color: '#ff88cc',
    size: 0.1,
    sizeAttenuation: true,
    transparent: true,
    alphaMap: particleTexture,
    depthWrite: false,
    // blending: THREE.AdditiveBlending,
    vertexColors: true
})

//Points
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

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
    const elapasedTime = clock.getElapsedTime();

    for(let i = 0; i < count; i++) {
        const i3 = i * 3;

        const x = particleGeometry.attributes.position.array[i3];
        particleGeometry.attributes.position.array[i3 + 1] = Math.sin(elapasedTime + x);
    }

    particleGeometry.attributes.position.needsUpdate = true;

    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();