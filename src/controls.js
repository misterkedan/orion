import { Vector2, Vector3, Raycaster } from 'three';

import { render } from './render';
import { stage } from './stage';
import { settings } from './settings';

const { style } = document.body;
const { camera, scene } = stage;
const pointer = new Vector2();
const raycaster = new Raycaster();

function onPointerMove( event ) {

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = 1 - ( event.clientY / window.innerHeight ) * 2;

}

function onPointerUp( event ) {

	onPointerMove( event );
	if ( controls.intersects ) settings.random();

}

function onTouchStart( event ) {

	event.preventDefault();

}

function update() {

	const { intersects } = controls;
	const { target, origin, targetXY, lookAt, lerpSpeed } = controls.camera;

	target.x = origin.x + targetXY.x * pointer.x;
	target.y = origin.y + targetXY.y * pointer.y;
	target.z = origin.z;

	camera.position.lerp( target, lerpSpeed );
	camera.lookAt( lookAt );

	style.cursor = ( intersects ) ? 'pointer' : 'auto';

}

const controls = {
	pointer,
	raycaster,
	update,
	init: () => {

		const { canvas } = render;
		canvas.addEventListener( 'pointerDown', onPointerMove );
		canvas.addEventListener( 'pointermove', onPointerMove );
		canvas.addEventListener( 'pointerup', onPointerUp );
		canvas.addEventListener( 'touchstart', onTouchStart );


	},
	resize: ( width, height ) => {

		camera.position.set( 0, 0.5, 10 );
		if ( width < height ) camera.position.z = 14;

		controls.camera = {
			lookAt: new Vector3( 0, 0, 0 ),
			origin: new Vector3(),
			target: new Vector3(),
			targetXY: new Vector2( 5, 1 ),
			lerpSpeed: 0.02,
		};
		controls.camera.origin.copy( camera.position );

	},
	get intersects() {

		raycaster.setFromCamera( pointer, camera );
		return raycaster.intersectObjects( scene.children, false ).length;

	},
};

export { controls };
