import { TextureLoader } from 'three';

import winlo from 'winlo';

import { Ticker } from './core/Ticker';
import { Floor } from './scene/Floor';
import { Orb } from './scene/Orb.js';

import { render } from './render';
import { stage } from './stage';
import { settings } from './settings';
import { controls } from './controls';
import { gui } from './gui';

// Init

if ( ! winlo.hash && ! winlo.search ) {

	winlo.hash = '#';
	winlo.search = '';

}

winlo.toFixedDigits = 2;
settings.load();

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

const MAX_FPS = 60;
const ticker = new Ticker( animate, MAX_FPS );

// Load texture then init

const loader = new TextureLoader();

loader.load(
	'textures/polished_concrete_basecolor.jpg', // URL
	( texture ) => init( texture ), // onLoad
	undefined,		// onProgress
	() => init() 	// onError
);

function init( texture ) {

	settings.init( orb );
	floor.init( texture, scene );
	render.init( renderer, scene, camera );
	controls.init();

	window.addEventListener( 'resize', resize );
	resize();

	ticker.start();

	setTimeout( gui.init, 0 ); // temp hack for weird dat.gui+winlo bug

}
