import { TextureLoader } from 'three';
import winlo from 'winlo';

import { Floor } from './scene/Floor';
import { Orb } from './scene/Orb.js';
import { Ticker } from './misc/Ticker';

import { controls } from './controls';
import { gui } from './gui';
import { render } from './render';
import { stage } from './stage';
import { settings } from './settings';

// Load settings

winlo.init();
winlo.digits = 2;
settings.load();

// Build scene

const { scene } = stage;

const floor = new Floor();
floor.position.y =  - 1.35;
scene.add( floor );

const orb = new Orb();
scene.add( orb );

// Load texture

const loader = new TextureLoader();

loader.load(
	'textures/polished_concrete_basecolor.jpg', // URL
	( texture ) => init( texture ), // onLoad
	undefined,		// onProgress
	() => init() 	// onError
);

// Callbacks

function init( texture ) {

	settings.init( orb );
	floor.init( texture );
	render.init();
	controls.init();
	setTimeout( gui.init, 0 ); // hack for weird dat.gui + winlo bug

	window.addEventListener( 'resize', resize );
	resize();

	const ticker = new Ticker( animate, 60 );
	ticker.start();

}

function resize() {

	const { innerWidth, innerHeight, devicePixelRatio } = window;

	const width = innerWidth;
	const height = innerHeight;

	const toResize = [ stage, render, floor, controls ];
	toResize.forEach( item => item.resize( width, height, devicePixelRatio ) );

	orb.position.z = ( width < height ) ? 2 : 0;

}

function animate( time ) {

	const toUpdate = [ controls, orb, render ];
	toUpdate.forEach( item => item.update( time ) );

}
