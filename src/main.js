import { TextureLoader } from 'three';

import winlo from 'winlo';

import { AnimationClock } from './keda/AnimationClock';
import { Floor } from './scene/Floor';
import { Orb } from './scene/Orb.js';
import { render } from './render';
import { stage } from './stage';
import { controls } from './controls';
import { settings } from './settings';
import { gui } from './gui';

// Init

if ( ! winlo.hash && ! winlo.search ) {

	winlo.hash = '#/';
	winlo.search = '';

}

const { renderer, canvas, scene, camera } = stage;
document.getElementById( 'main' ).appendChild( canvas );

// Scene

const floor = new Floor( 110 );
floor.position.y = - 1.35;
scene.add( floor );

const orb = new Orb( 320 );
scene.add( orb );

// Resize

function resize() {

	const { innerWidth, innerHeight, devicePixelRatio } = window;

	//const width = Math.round( innerWidth / devicePixelRatio );
	//const height = Math.round( innerHeight / devicePixelRatio );
	const width = innerWidth;
	const height = innerHeight;

	[ stage, render, floor, controls ].forEach( item =>
		item.resize( width, height, devicePixelRatio )
	);

	orb.position.z = ( width < height ) ? 2 : 0;


}

// Animate

function animate( time ) {

	controls.update();
	orb.update( time );
	render.update();

}

//const mobile = !! navigator.maxTouchPoints &&
//	Math.max( window.innerWidth, window.innerHeight ) < 1000;
//const maxFPS = ( mobile ) ? 60 : 0;
const MAX_FPS = 60;
const clock = new AnimationClock( animate, MAX_FPS );

// Load texture then init

const loader = new TextureLoader();

loader.load(
	'textures/polished_concrete_basecolor.jpg', // URL
	( texture ) => init( texture ), // onLoad
	undefined,		// onProgress
	() => init() 	// onError
);

function init( texture ) {

	floor.init( texture, scene );
	render.init( renderer, scene, camera );

	window.addEventListener( 'resize', resize );
	resize();

	settings.orb = orb;
	settings.init();
	gui.init();

	controls.init( orb );

	clock.start();

}
