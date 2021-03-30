import './style.scss'
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
const textureLoader = new THREE.TextureLoader();
const matcapText = textureLoader.load('/static/matcaps/8.png');
const matcapDonut = textureLoader.load('/static/matcaps/2.png');

/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader();
fontLoader.load('/static/fonts/COCOGOOSE_DemiBold.json', font => {
    const textGeometry = new THREE.TextBufferGeometry('NIKOLA', {
        font: font,
        size: 2,
        height: 0.2,
        curveSegment: 8,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    })
    textGeometry.center();

    const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapText });
    const text = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(text);

    const donutGeometry = new THREE.TorusBufferGeometry(.4, .2, 30, 30);
    const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapDonut });

    for(let i = 0; i < 200; i++){
        const donut = new THREE.Mesh(donutGeometry, donutMaterial);

        donut.position.x = (Math.random() - 0.5) * 20;
        donut.position.y = (Math.random() - 0.5) * 20;
        donut.position.z = (Math.random() - 0.5) * 20;

        donut.rotation.x = Math.random() * Math.PI
        donut.rotation.y = Math.random() * Math.PI

        const scale = Math.random();
        donut.scale.set(scale, scale, scale);

        scene.add(donut);
    }
});

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