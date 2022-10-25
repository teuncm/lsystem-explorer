import './style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Simulation, Vec2D, PRESETS } from "./index"

let camera: THREE.PerspectiveCamera;
let controls: OrbitControls;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;

const COLOR_BG = new THREE.Color( 0x000000 );
const COLOR_GRID = new THREE.Color( 0x444444 );

const HUE_RANGE = 300;

const CAM_MIN_DIST = 1;
const CAM_PADDING = 1.05;
const CAM_OFFSET_Z = 1;

const BASE_Y = 1;

const FOV_DEG = 40;

const GRID_SIZE = 10;
const GRID_DIVISIONS = 5;
const GRID_ITER = 5;

setupScene();
addGrid();

let lSystem = PRESETS.tree;
let nIter = 17;

let simulation = new Simulation(lSystem);

for(let i = 0; i <= nIter; i++) {
    simulation.iterate();
    simulation.traverseAxiom();

    let axiomHeight = nIter - i + 1;
    let hueFactor = i/nIter;

    addAxiomToScene(simulation.points, axiomHeight, getColorString(hueFactor));
}

focus(simulation);

function getColorString(hueFactor: number) {
    return "hsl(" + (HUE_RANGE - hueFactor*HUE_RANGE) + ", 100%, 50%)";
}

/**
 * Initial empty scene setup, add event listeners.
 */
function setupScene() {
    scene = new THREE.Scene();
    scene.background = COLOR_BG;

    renderer = new THREE.WebGLRenderer( {
        antialias: false,
        powerPreference: 'high-performance',
        stencil: false,
	    depth: true,
        logarithmicDepthBuffer: true,
    } );
    renderer.setPixelRatio( 1 );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( FOV_DEG, window.innerWidth / window.innerHeight, 1, 400000 );
    camera.position.set( 0, BASE_Y + CAM_MIN_DIST, CAM_OFFSET_Z );

    controls = new OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render );
    controls.screenSpacePanning = false;
    controls.minDistance = CAM_MIN_DIST;
    controls.maxDistance = 250000;
    controls.maxPolarAngle = Math.PI / 2;
    controls.panSpeed = 2;
    controls.target = new THREE.Vector3( 0, BASE_Y, 0 );
    controls.update();

    window.addEventListener( 'resize', onWindowResize );
}

/**
 * Add exponentially growing grid to the scene.
 */
function addGrid() {
    for(let i = 0; i < GRID_ITER; i++) {
        let grid = new THREE.GridHelper( GRID_SIZE*(GRID_DIVISIONS**i), GRID_DIVISIONS, COLOR_GRID, COLOR_GRID );
        grid.matrixAutoUpdate = false;
        (<THREE.LineBasicMaterial>grid.material).depthWrite = false;

        scene.add( grid );
    }
}

function addAxiomToScene(points2D: Vec2D[], axiomHeight: number, colorString: string) {
    const material = new THREE.LineBasicMaterial( {color: colorString } );

    const points = [];
    for(let point2D of points2D) {
        points.push( new THREE.Vector3( point2D.x, axiomHeight, point2D.y ) );
    }

    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const lines3D = new THREE.LineSegments( geometry, material );
    lines3D.matrixAutoUpdate = false;

    scene.add( lines3D );
}

/**
 * Focus on the given point in the scene using the given camera distance.
 * @param camDist
 * @param center2D
 */
function focus(simulation: Simulation) {
    let min2D = simulation.min;
    let max2D = simulation.max;
    let center2D = min2D.add(max2D).mult(1/2);

    let w = max2D.x - min2D.x;
    let h = max2D.y - min2D.y;
    let fovRad = FOV_DEG * Math.PI / 180;

    let camDistW = w/2 / Math.tan(fovRad/2);
    let camDistH = h/2 / Math.tan(fovRad/2);
    let camDist = BASE_Y + CAM_PADDING*Math.max(camDistW, camDistH, CAM_MIN_DIST);

    camera.position.set( center2D.x, camDist, center2D.y + CAM_OFFSET_Z );

    controls.target = new THREE.Vector3( center2D.x, BASE_Y, center2D.y );
    controls.update();
}

/**
 * Update camera and renderer on window resize.
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    render();
}

/**
 * Render the scene.
 */
function render() {
    renderer.render( scene, camera );
}
