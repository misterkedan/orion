import * as dat from 'dat.gui';
import vesuna from 'vesuna';

import { App } from './scene/alien/App';
import { RenderManager } from './scene/alien/RenderManager';

import { config } from './config';

const copy = ( object ) => JSON.parse( JSON.stringify( object ) );

const SPEED_CAP = 100;
const RANDOM_CAP = 30;

const randomized = {
	adjustments: {
		hue: { min: 0, max: 2 * Math.PI },
		saturation: { min: 0, max: 3 },
	},
	sphere: {
		passes: { min: 2, max: 4, round: true },
		speed: { min: 1, max: RANDOM_CAP, round: true },
		smoothness: { min: 5, max: 10, round: true },
		value1: { min: 0, max: 1 },
		value2: { min: 0, max: 1 },
	},
	rotationSpeed: {
		x: { min: - RANDOM_CAP, max: RANDOM_CAP, round: true },
		y: { min: - RANDOM_CAP, max: RANDOM_CAP, round: true },
		z: { min: - RANDOM_CAP, max: RANDOM_CAP, round: true },
	},
};

const settings = {
	defaults: copy( config ),
	current: copy( config ),
	reset: () => {

		settings.current = copy( settings.defaults );
		console.log( settings.current );
		settings.update();

	},
	random: ( seed ) => {

		if ( seed ) vesuna.seed = seed;
		else vesuna.autoseed();

		const setRandomValue = ( target, key, value )=> {

			const { min, max, round } = value;
			target[ key ] = vesuna.random( min, max, round );

		};

		let { current } = settings;

		Object.entries( randomized.adjustments ).forEach( ( [ key, value ] ) => {

			if ( vesuna.random() > 0.5 )
				setRandomValue( current.adjustments, key, value );
			else current.adjustments[ key ] = 0;

		} );

		Object.entries( randomized.sphere ).forEach( ( [ key, value ] ) =>
			setRandomValue( current.sphere, key, value )
		);

		Object.entries( randomized.rotationSpeed ).forEach( ( [ key, value ] ) => {

			if ( vesuna.random() > 0.66 )
				setRandomValue( current.sphere.rotationSpeed, key, value );
			else current.sphere.rotationSpeed[ key ] = 0;

		} );

		settings.update();

	},
	update:() => {

		const { current } = settings;

		Object.entries( current.adjustments ).forEach( ( [ key, value ] ) => {

			RenderManager.post.adjustments[ key ] = value;

		} );

		Object.entries( current.sphere ).forEach( ( [ key, value ] ) => {

			if ( key !== 'rotationSpeed' ) sphere[ key ] = value;

		} );

		Object.entries( current.sphere.rotationSpeed ).forEach( ( [ key, value ] ) => {

			sphere.rotationSpeed[ key ] = value;

		} );

		gui.updateDisplay();

	}
};

App.init();

const sphere = App.view.sphere;

const gui = new dat.GUI();

const plasma = gui.addFolder( 'Plasma Remix' );
plasma.add( sphere, 'passes', 1, 4 ).step( 1 );
plasma.add( sphere, 'smoothness', 3, 30 );
plasma.add( sphere, 'speed', 1, SPEED_CAP ).step( 1 );
plasma.open();

const rotation = gui.addFolder( 'Rotation' );
rotation.add( sphere.rotationSpeed, 'x', - SPEED_CAP, SPEED_CAP ).step( 1 );
rotation.add( sphere.rotationSpeed, 'y', - SPEED_CAP, SPEED_CAP ).step( 1 );
rotation.add( sphere.rotationSpeed, 'z', - SPEED_CAP, SPEED_CAP ).step( 1 );
rotation.open();

const color = gui.addFolder( 'Color' );
color.add( sphere, 'value1', 0, 1 ).step( 0.01 ).listen();
color.add( sphere, 'value2', 0, 1 ).step( 0.01 ).listen();
color.add( sphere, 'invert' );
color.open();

const post = gui.addFolder( 'Post-processing' );
post.add( RenderManager.post.adjustments, 'hue', 0, Math.PI * 2 ).step( 0.01 );
post.add( RenderManager.post.adjustments, 'saturation', 0, 3 );
post.open();

const set = gui.addFolder( 'Settings' );
set.add( settings, 'reset' );
set.add( settings, 'random' );
set.open();

const pixelRatio = window.devicePixelRatio > 2 ? 2 : 1;
const largeWidth = pixelRatio * 640;
if ( window.innerWidth < largeWidth ) gui.close();

//gui.close();
