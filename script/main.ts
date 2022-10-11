import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LSystem, Line2D, Vec2D } from "./index.js"

let camera: any, controls: any, scene: any, renderer: any;

init();
render();

function init() {
    /* Fractal binary tree */
    // let axiom = "A";
    // let grammar = { "A": "B[+A]-A", "B": "BB" };
    // let theta = Math.PI / 4;

    /* Sierpinski triangle */
    // let axiom = "A-B-B";
    // let grammar = { "A": "A-B+A+B-A", "B": "BB" };
    // let theta = 2 * Math.PI / 3;

    /* Dragon curve */
    let axiom = "A";
    let grammar = { "A": "A+B", "B": "A-B" };
    let theta = 2 * Math.PI / 4;

    let lSystem = new LSystem(axiom, grammar, theta);
    lSystem.iterateN(12);
    lSystem.traverseAxiom();

    let lines2D = lSystem.lines;
    let min2D = lSystem.min;
    let max2D = lSystem.max;

    let axiomY = 1;

    let fovDeg = 50;
    let fovRad = fovDeg * Math.PI / 180;

    let w = max2D.x - min2D.x;
    let h = max2D.y - min2D.y;

    let distW = w/2 / Math.tan(fovRad/2);
    let distH = h/2 / Math.tan(fovRad/2);

    let minDist = 2;
    let dist = Math.max(distW, distH) + minDist;
    let center2D = min2D.add(max2D).mult(1/2);

    setupScene(center2D, dist, fovDeg, minDist, axiomY);
    addAxiom(scene, lines2D, axiomY);
    addGrid(10, 5, 5);
}

function setupScene(center2D: Vec2D, dist: number, fovDeg: number, minDist: number, axiomY: number) {
    scene = new THREE.Scene();
    scene.background = 0x000000;

    renderer = new THREE.WebGLRenderer( { antialias: false, powerPreference: 'high-performance' } );
    renderer.setPixelRatio( 1 );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( fovDeg, window.innerWidth / window.innerHeight, 0.1, 1000000 );
    camera.position.set(center2D.x, dist, center2D.y + 1 );

    controls = new OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render );
    controls.screenSpacePanning = false;
    controls.minDistance = minDist;
    controls.maxDistance = 100000;
    controls.maxPolarAngle = Math.PI / 2;
    controls.panSpeed = 2;
    controls.target = new THREE.Vector3( center2D.x, axiomY, center2D.y );
    controls.update();

    window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight);
    render();
}

function render() {
    renderer.render( scene, camera );
}

function addGrid(size: number, divisions: number, nIter: number) {
    for(let i = 0; i < nIter; i++) {
        scene.add( new THREE.GridHelper( size*(divisions**i), divisions, 0x444444, 0x444444 ) );
    }
}

function addAxiom(scene: any, lines2D: Line2D[], axiomY: number) {
    const material = new THREE.LineBasicMaterial( { color: 0xffffff } );

    const points = [];

    for (let line2D of lines2D) {
        points.push( new THREE.Vector3( line2D.from.x, axiomY, line2D.from.y ) );
        points.push( new THREE.Vector3( line2D.to.x, axiomY, line2D.to.y ) );
    }

    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    const lines3D = new THREE.LineSegments( geometry, material );
    lines3D.matrixAutoUpdate = false;
    scene.add( lines3D );
}
