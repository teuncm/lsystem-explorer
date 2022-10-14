import './style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { LSystem, Line2D, Vec2D } from "./index"

let camera: THREE.PerspectiveCamera;
let controls: OrbitControls;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;

const COLOR_BG = new THREE.Color( 0x000000 );
const COLOR_GRID = new THREE.Color( 0x444444 );
const COLOR_AXIOM = new THREE.Color( 0xffffff );

const INIT_DIST = 100;
const MIN_DIST = 1;
const CAM_OFFSET_Z = 1;

const AXIOM_Y = 1;
const FOV_DEG = 50;

const GRID_SIZE = 10;
const GRID_DIVISIONS = 5;
const GRID_ITER = 5;

init();

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
    let grammar = {"A": "A+B", "B": "A-B"};
    let theta = 2 * Math.PI / 4;

    let lSystem = new LSystem(axiom, grammar, theta);
    lSystem.iterateN(10);
    lSystem.traverseAxiom();

    let lines2D = lSystem.lines;

    let min2D = lSystem.min;
    let max2D = lSystem.max;
    let center2D = min2D.add(max2D).mult(1/2);

    let w = max2D.x - min2D.x;
    let h = max2D.y - min2D.y;

    let fovRad = FOV_DEG * Math.PI / 180;

    let distW = w/2 / Math.tan(fovRad/2);
    let distH = h/2 / Math.tan(fovRad/2);

    let camDist = Math.max(distW, distH) + MIN_DIST + AXIOM_Y;

    setupScene();
    addGrid();
    // render();

    addAxiom(scene, lines2D);
    focus(camDist, center2D);
}

function setupScene() {
    scene = new THREE.Scene();
    scene.background = COLOR_BG;

    renderer = new THREE.WebGLRenderer( { antialias: false, powerPreference: 'high-performance' } );
    renderer.setPixelRatio( 1 );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( FOV_DEG, window.innerWidth / window.innerHeight, 0.1, 1000000 );
    camera.position.set( 0, INIT_DIST, 0 );

    controls = new OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render );
    controls.screenSpacePanning = false;
    controls.minDistance = MIN_DIST;
    controls.maxDistance = 100000;
    controls.maxPolarAngle = Math.PI / 2;
    controls.panSpeed = 2;
    controls.target = new THREE.Vector3( 0, 0, 0 );
    controls.update();

    window.addEventListener( 'resize', onWindowResize );
}

function focus(camDist: number, center2D: Vec2D) {
    camera.position.set( center2D.x, camDist, center2D.y + CAM_OFFSET_Z );

    controls.target = new THREE.Vector3( center2D.x, AXIOM_Y, center2D.y );
    controls.update();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    render();
}

function render() {
    renderer.render( scene, camera );
}

function addGrid() {
    for(let i = 0; i < GRID_ITER; i++) {
        let grid = new THREE.GridHelper( GRID_SIZE*(GRID_DIVISIONS**i), GRID_DIVISIONS, COLOR_GRID, COLOR_GRID );
        grid.matrixAutoUpdate = false;

        scene.add( grid );
    }
}

function addAxiom(scene: any, lines2D: Line2D[]) {
    const material = new THREE.LineBasicMaterial( {color: COLOR_AXIOM } );

    const points = [];
    for(let line2D of lines2D) {
        points.push( new THREE.Vector3( line2D.from.x, AXIOM_Y, line2D.from.y ) );
        points.push( new THREE.Vector3( line2D.to.x, AXIOM_Y, line2D.to.y ) );
    }

    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const lines3D = new THREE.LineSegments( geometry, material );
    lines3D.matrixAutoUpdate = false;

    scene.add( lines3D );
}
