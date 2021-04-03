import '../style.scss'
import * as dat from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Debug
 */
const gui = new dat.GUI({width: 360});

/**
 * Canvas
 */
const canvas = document.querySelector('.webgl');

/**
 * Creating a scene
 */
 const scene = new THREE.Scene();


/**
 * Galaxy
 */
 const parameters = {
    // Number of particles
    count: 1e5,
    // Size of single particle
    size: 0.001,
    // How futher does galaxy go
    radius: 5,
    // Number of branches, as of tree
    branches: 3,
    // How spiraly are brunches
    spin: 3,
    // Density of stars around branches
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: "#1b3984"
}

let geometry = null;
let material = null;
let points = null;

/**
 * Full circle has 6.28rad or 2π
 * One rad is ~57.3
 */

const generateGalaxy = () => {
    // Destroy old galaxy when playing in gui
    if(points !== null){
        geometry.dispose();
        material.dispose();
        scene.remove(points);
    }

    geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for(let i = 0; i < parameters.count; i++){
        const i3 = i * 3;

        // Positioning
        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

        const randomX = Math.pow(Math.random(), parameters.randomnessPower);
        const randomY = Math.pow(Math.random(), parameters.randomnessPower);
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower);

        positions[i3    ] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // Colors - clone the color
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius/parameters.radius);

        colors[i3    ] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }
    // Geometry attributes
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    //Material
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        vertexColors: true
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);
}

/**
 * Debugging
 */
gui.add(parameters, 'count').min(100).max(1e6).step(100).onFinishChange(generateGalaxy);
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, 'spin').min(-10).max(10).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.01).onFinishChange(generateGalaxy);
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);

generateGalaxy();

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
camera.position.set(3, 3, 3);
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