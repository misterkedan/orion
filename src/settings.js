import cloneDeep from 'lodash.clonedeep';
import vesuna from 'vesuna';
import winlo from 'winlo';

import { config } from './config';
import { gui } from './gui';
import { render } from './render';

let settings;

/*-----------------------------------------------------------------------------/

	Private

/-----------------------------------------------------------------------------*/

const ROTATION_KEY = 'rotationSpeed';

function read() {

	const { orb, current } = settings;

	Object.keys( current.adjustments ).forEach( key => {

		current.adjustments[ key ] = winlo.round( render.post.adjustments[ key ] );

	} );

	Object.keys( current.orb ).forEach( key => {

		if ( key === ROTATION_KEY ) return;
		current.orb[ key ] = winlo.round( orb[ key ] );

	} );

	Object.keys( current.orb.rotationSpeed ).forEach( key => {

		current.orb.rotationSpeed[ key ] = winlo.round( orb.rotationSpeed[ key ] );

	} );

}

function write() {

	const { orb, current } = settings;
	if ( ! settings.orb ) return;

	const { adjustments } = render.post;
	Object.entries( current.adjustments ).forEach( ( [ key, value ] ) => {

		adjustments[ key ] = value;

	} );

	Object.entries( current.orb ).forEach( ( [ key, value ] ) => {

		if ( key !== ROTATION_KEY ) orb[ key ] = value;

	} );

	Object.entries( current.orb.rotationSpeed ).forEach( ( [ key, value ] ) => {

		orb.rotationSpeed[ key ] = value;

	} );

	gui.updateDisplay();

}

function applyHash() {

	const { TITLE } = config;
	const { hash } = winlo;

	document.title = ( hash ) ? `${TITLE} #${hash}` : TITLE;

	if ( hash ) random( hash );
	else reset( false );

}

function applyDefaults() {

	const { defaults } = config;
	settings.current = cloneDeep( defaults );
	settings.reference = cloneDeep( defaults );

}

function initStorage() {

	const { STORAGE_LAST, STORAGE_GUI, STORAGE_DURATION } = config;
	const { localStorage } = window;

	const now = Date.now();
	const last = parseInt( localStorage.getItem( STORAGE_LAST ) ) || now;
	const elapsed = now - last;
	if ( elapsed > STORAGE_DURATION ) localStorage.clear();

	const gui = window.localStorage.getItem( STORAGE_GUI );
	settings.closeGUI = ( gui === 'false' ) ? false : true;

	localStorage.setItem( STORAGE_LAST, now );

}

/*-----------------------------------------------------------------------------/

	Public

/-----------------------------------------------------------------------------*/

const { WINLO_PARAM } = config;
const hash = 'seed';

function random( seed ) {

	if ( seed ) vesuna.seed = seed;
	else vesuna.autoseed();

	settings.current.seed = vesuna.seed;

	const setRandomValue = ( target, key, value )=> {

		const { min, max, round } = value;
		const random = vesuna.random( min, max, round );
		target[ key ] = winlo.round( random );

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

	settings.reference = cloneDeep( settings.current );

	write();

	if ( ! seed ) {

		seed = vesuna.seed;
		winlo.save( { seed }, false, { hash } );

	}

}

function load() {

	applyHash();
	winlo.load( settings.current, WINLO_PARAM, { hash } );

	write();

}

function save() {

	read();

	const { current, reference } = settings;
	winlo.save( current, WINLO_PARAM, { reference, hash } );

}

function reset( hardReset = true ) {

	if ( hardReset ) winlo.reset();

	applyDefaults();
	write();

}

function init( orb ) {

	initStorage();
	settings.orb = orb;
	window.addEventListener( 'hashchange', applyHash );

}

settings = { random, save, load, reset, init };
applyDefaults();

export { settings };
