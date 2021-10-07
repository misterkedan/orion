import {
	ACESFilmicToneMapping,
	Color,
	DirectionalLight,
	Fog,
	HemisphereLight,
	PerspectiveCamera,
	WebGLRenderer,
	Scene
} from 'three';

// Core setup

const renderer = new WebGLRenderer( {
	powerPreference: 'high-performance',
	stencil: false,
} );
renderer.toneMapping = ACESFilmicToneMapping;

const canvas = renderer.domElement;
document.getElementById( 'main' ).appendChild( canvas );

const scene = new Scene();
scene.background = new Color( 0x222326 );
scene.fog = new Fog( scene.background, 1, 50 );

const camera = new PerspectiveCamera( 30 );
camera.near = 0.5;
camera.far = 50;

// Lights

const hemisphere = new HemisphereLight( 0x606060, 0x404040 );

const directional = new DirectionalLight( 0xffffff );
directional.position.set( 1, 1, 1 );

const lights = { hemisphere, directional };
Object.values( lights ).forEach( light => scene.add( light ) );

// Resize

function resize( width, height, devicePixelRatio ) {

	renderer.setPixelRatio( devicePixelRatio );

	renderer.setSize( width, height );
	camera.aspect = width / height;
	camera.updateProjectionMatrix();

}

const stage = { renderer, canvas, scene, camera, lights, resize };

export { stage };
