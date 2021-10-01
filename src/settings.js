import vesuna from 'vesuna';
import winlo from 'winlo';

import { RenderManager } from './scene/alien/RenderManager';
import { config } from './config';
import { gui } from './gui';

const RANDOM_CAP = 30;

function copy( object ) {

	return JSON.parse( JSON.stringify( object ) );

}

const settings = {

	sphere: null,

	defaults: copy( config ),
	current: copy( config ),
	base: copy( config ),

	init: () => {

		settings.load();
		window.addEventListener( 'hashchange', settings.applyHash );

	},

	randomize: {
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
	},

	reset: ( hardReset = true ) => {

		if ( hardReset ) {

			winlo.clear();
			winlo.hash = '#/';

		}

		let { defaults, update, save } = settings;

		settings.current = copy( defaults );
		settings.base = copy( defaults );
		update();

		if ( hardReset ) save();

	},

	random: ( seed ) => {

		let { current, randomize } = settings;

		const setRandomValue = ( target, key, value )=> {

			const { min, max, round } = value;
			target[ key ] = vesuna.random( min, max, round );

		};

		if ( seed ) vesuna.seed = seed;
		else vesuna.autoseed();

		current.seed = vesuna.seed;

		Object.entries( randomize.adjustments ).forEach( ( [ key, value ] ) => {

			if ( vesuna.random() > 0.5 )
				setRandomValue( current.adjustments, key, value );
			else current.adjustments[ key ] = 0;

		} );

		Object.entries( randomize.sphere ).forEach( ( [ key, value ] ) =>
			setRandomValue( current.sphere, key, value )
		);

		Object.entries( randomize.rotationSpeed ).forEach( ( [ key, value ] ) => {

			if ( vesuna.random() > 0.66 )
				setRandomValue( current.sphere.rotationSpeed, key, value );
			else current.sphere.rotationSpeed[ key ] = 0;

		} );

		settings.base = copy( settings.current );

		settings.update();

		if ( ! seed ) {

			seed = vesuna.seed;
			winlo.save( { seed }, false, { hash:'seed' } );
			winlo.clear();

		}

	},

	update:() => {

		const { current, sphere } = settings;

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

	},

	applyHash: () => {

		const hash = winlo.hash;

		const TITLE = 'Plasma Remix';
		document.title = ( hash ) ? `${TITLE} #${hash}` : TITLE;

		if ( hash ) settings.random( hash );
		else settings.reset( false );

	},

	load: () => {

		const { current, update } = settings;

		settings.applyHash();

		winlo.load( current, 'settings', { hash: 'seed' } );

		update();

	},

	save: ()=> {

		const { current, base, sphere } = settings;

		Object.keys( current.adjustments ).forEach( key => {

			current.adjustments[ key ] = RenderManager.post.adjustments[ key ];

		} );

		Object.keys( current.sphere ).forEach( key => {

			if ( key === 'rotationSpeed' ) return;
			current.sphere[ key ] = sphere[ key ];

		} );

		Object.keys( current.sphere.rotationSpeed ).forEach( key => {


			current.sphere.rotationSpeed[ key ] = sphere.rotationSpeed[ key ];

		} );

		const { seed } = current;
		if ( seed ) winlo.save( { seed }, false, { hash:'seed' } );
		winlo.save( current, 'settings', { defaults: base, hash: 'seed' } );

	},
};

export { settings };
