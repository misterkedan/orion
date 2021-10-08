import { TextureLoader } from 'three';

import winlo from 'winlo';

import { Floor } from './scene/Floor';
import { Orb } from './scene/Orb.js';
import { Ticker } from './core/Ticker';

import { config } from './config';
import { controls } from './controls';
import { gui } from './gui';
import { render } from './render';
import { stage } from './stage';
import { settings } from './settings';

const {
	FLOOR_SIZE,
	FLOOR_TEXTURE_URL,
	FLOOR_Y,
	MAX_FPS,
	ORB_Z_LANDSCAPE,
	ORB_Z_PORTRAIT,
	ORB_SEGMENTS,
	DIGITS,
} = config;

// Load settings

winlo.init();
winlo.digits = DIGITS;
settings.load();

// Scene

const { renderer, scene, camera } = stage;

const floor = new Floor( FLOOR_SIZE );
floor.position.y = FLOOR_Y;
scene.add( floor );

const orb = new Orb( ORB_SEGMENTS );
scene.add( orb );

// Resize

function resize() {

	const { innerWidth, innerHeight, devicePixelRatio } = window;

	const width = innerWidth;
	const height = innerHeight;

	[ stage, render, floor, controls ].forEach( item =>
		item.resize( width, height, devicePixelRatio )
	);

	orb.position.z = ( width < height ) ? ORB_Z_PORTRAIT : ORB_Z_LANDSCAPE;


}

// Animate

function animate( time ) {

	controls.update();
	orb.update( time );
	render.update();

}

const ticker = new Ticker( animate, MAX_FPS );

// Load floor texture, then init

const loader = new TextureLoader();

loader.load(
	FLOOR_TEXTURE_URL, // URL
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

	setTimeout( gui.init, 0 ); // hack for weird dat.gui + winlo bug

}
