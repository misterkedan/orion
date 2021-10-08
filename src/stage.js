import {
	Color, DirectionalLight, Fog, HemisphereLight, PerspectiveCamera, Scene
} from 'three';

// Scene

const scene = new Scene();
scene.background = new Color( 0x222326 );
scene.fog = new Fog( scene.background, 1, 50 );

// Camera

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

function resize( width, height ) {

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

}

const stage = { scene, camera, lights, resize };

export { stage };
