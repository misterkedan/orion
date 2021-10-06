import cloneDeep from 'lodash.clonedeep';
import winlo from 'winlo';
import vesuna from 'vesuna';

import { gui } from './gui';
import { config } from './config';
import { render } from './render';

let settings;

/*-----------------------------------------------------------------------------/

	Private

/-----------------------------------------------------------------------------*/

function read() {

	const { orb, current } = settings;

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

}

function write() {

	const { orb, current } = settings;
	if ( ! settings.orb ) return;

	console.log( current );

	const { adjustments } = render.post;
	Object.entries( current.adjustments ).forEach( ( [ key, value ] ) => {

		adjustments[ key ] = value;

	} );

	Object.entries( current.orb ).forEach( ( [ key, value ] ) => {

		if ( key !== 'rotationSpeed' ) orb[ key ] = value;

	} );

	Object.entries( current.orb.rotationSpeed ).forEach( ( [ key, value ] ) => {

		orb.rotationSpeed[ key ] = value;

	} );

	gui.updateDisplay();

}

function applyHash() {

	const { hash } = winlo;

	const TITLE = 'Orion';
	document.title = ( hash ) ? `${TITLE} #${hash}` : TITLE;

	if ( hash ) random( hash );
	else reset( false );

}

function applyDefaults() {

	const { defaults } = config;
	settings.current = cloneDeep( defaults );
	settings.base = cloneDeep( defaults );

}

/*-----------------------------------------------------------------------------/

	Public

/-----------------------------------------------------------------------------*/

const WINLO_PARAM = 'settings';
const SEED = 'seed';

function random( seed ) {

	if ( seed ) vesuna.seed = seed;
	else vesuna.autoseed();

	settings.current.seed = vesuna.seed;

	const setRandomValue = ( target, key, value )=> {

		const { min, max, round } = value;
		const random = vesuna.random( min, max, round );
		const digits = Math.pow( 10, 2 );
		target[ key ] = Math.round( random * digits ) / digits;

	};

	const { random } = config;
	const { adjustments, orb } = settings.current;

	Object.entries( random.adjustments ).forEach( ( [ key, value ] ) => {

		if ( vesuna.random() > 0.5 ) setRandomValue( adjustments, key, value );
		else adjustments[ key ] = ( vesuna.bool() ) ? value.min : value.max;

	} );

	Object.entries( random.orb ).forEach( ( [ key, value ] ) =>
		setRandomValue( orb, key, value )
	);

	Object.entries( random.rotationSpeed ).forEach( ( [ key, value ] ) => {

		if ( vesuna.random() > 0.66 ) setRandomValue( orb.rotationSpeed, key, value );
		else orb.rotationSpeed[ key ] = 0;

	} );

	settings.base = cloneDeep( settings.current );

	write();

	if ( ! seed ) {

		seed = vesuna.seed;
		winlo.save( { seed }, false, { hash: SEED } );
		winlo.clear();

	}

}

function load() {

	applyHash();
	winlo.load( settings.current, WINLO_PARAM, { hash: SEED } );

	write();

}

function save() {

	read();

	const { current, base } = settings;
	winlo.save( current, WINLO_PARAM, { defaults: base, hash: SEED } );

}

function reset( hardReset = true ) {

	if ( hardReset ) {

		winlo.hash = '#';
		winlo.clear();

	}

	applyDefaults();
	write();

}

function init( orb ) {

	window.addEventListener( 'hashchange', applyHash );
	settings.orb = orb;

}

settings = { random, save, load, reset, init };
applyDefaults();

export { settings };
