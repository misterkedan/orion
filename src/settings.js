import vesuna from 'vesuna';
import winlo from 'winlo';

import { gui } from './gui';
import { render } from './render';

const RANDOM_CAP = 30;

function copy( object ) {

	return JSON.parse( JSON.stringify( object ) );

}

const settings = {

	orb: null,

	defaults: {

		orb: {
			passes: 3,
			speed: 6,
			smoothness: 7,

			value1: 0.7,
			value2: 0.9,

			rotationSpeed: {
				x: 0,
				y: 9,
				z: 0,
			},
		},

		bloom: {
			threshold: 0.6,
			strength: 0.2,
			radius: 0.8,
		},

		adjustments: {
			hue: 0,
			saturation: 1.5,
		},

	},
	base: null,
	current: null,

	init: () => {

		settings.load();
		window.addEventListener( 'hashchange', settings.applyHash );

	},

	randomize: {
		adjustments: {
			hue: { min: 0, max: 2 * Math.PI },
			saturation: { min: 0, max: 3 },
		},
		orb: {
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

		Object.entries( randomize.orb ).forEach( ( [ key, value ] ) =>
			setRandomValue( current.orb, key, value )
		);

		Object.entries( randomize.rotationSpeed ).forEach( ( [ key, value ] ) => {

			if ( vesuna.random() > 0.66 )
				setRandomValue( current.orb.rotationSpeed, key, value );
			else current.orb.rotationSpeed[ key ] = 0;

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

		const { current, orb } = settings;

		Object.entries( current.adjustments ).forEach( ( [ key, value ] ) => {

			render.post.adjustments[ key ] = value;

		} );

		Object.entries( current.orb ).forEach( ( [ key, value ] ) => {

			if ( key !== 'rotationSpeed' ) orb[ key ] = value;

		} );

		Object.entries( current.orb.rotationSpeed ).forEach( ( [ key, value ] ) => {

			orb.rotationSpeed[ key ] = value;

		} );

		gui.updateDisplay();

	},

	applyHash: () => {

		const hash = winlo.hash;

		const TITLE = 'Orion';
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

		const { current, base, orb } = settings;

		Object.keys( current.adjustments ).forEach( key => {

			current.adjustments[ key ] = render.post.adjustments[ key ];

		} );

		Object.keys( current.orb ).forEach( key => {

			if ( key === 'rotationSpeed' ) return;
			current.orb[ key ] = orb[ key ];

		} );

		Object.keys( current.orb.rotationSpeed ).forEach( key => {


			current.orb.rotationSpeed[ key ] = orb.rotationSpeed[ key ];

		} );

		const { seed } = current;
		if ( seed ) winlo.save( { seed }, false, { hash:'seed' } );
		winlo.save( current, 'settings', { defaults: base, hash: 'seed' } );

	},

};
settings.current = copy( settings.defaults );
settings.base = copy( settings.defaults );

export { settings };
