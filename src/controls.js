import { Vector2, Raycaster } from 'three';
import { WorldController } from './scene/alien/WorldController';


import { settings } from './settings';

const pointer = new Vector2();
const raycaster = new Raycaster();

function onPointerMove( event ) {

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;



}

function onPointerUp() {

	if ( controls.intersects ) settings.random();

}

const controls = {
	pointer,
	raycaster,

	get intersects() {

		const { scene } = WorldController;
		return controls.raycaster
			.intersectObjects( scene.children[ 2 ].children, false )
			.length;

	},

	init: () => {

		document.addEventListener( 'pointermove', onPointerMove );
		document.addEventListener( 'pointerup', onPointerUp );

	},
};

export { controls };
