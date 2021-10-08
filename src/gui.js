import * as dat from 'dat.gui';
import winlo from 'winlo';

import { render } from './render';
import { settings } from './settings';

const gui = new dat.GUI();

gui.init = function () {

	const { orb } = settings;
	const { adjustments } = render.post;

	const main = gui.addFolder( 'Orb' );
	main.add( orb, 'passes', 1, 4 ).step( 1 );
	main.add( orb, 'smoothness', 3, 30 ).step( 1 );
	main.add( orb, 'speed', 1, 100 ).step( 1 );
	main.open();

	const rotation = gui.addFolder( 'Rotation' );
	rotation.add( orb.rotationSpeed, 'x', - 100, 100 ).step( 1 );
	rotation.add( orb.rotationSpeed, 'y', - 100, 100 ).step( 1 );
	rotation.add( orb.rotationSpeed, 'z', - 100, 100 ).step( 1 );
	rotation.open();

	const floatStep = 1 / Math.pow( 10, winlo.digits );
	const color = gui.addFolder( 'Color' );
	color.add( orb, 'value1', 0, 1 ).step( floatStep );
	color.add( orb, 'value2', 0, 1 ).step( floatStep );
	color.add( adjustments, 'hue', 0, Math.PI * 2 ).step( floatStep );
	color.add( adjustments, 'saturation', 0, 3 ).step( floatStep );
	color.open();

	const SAVE_BUTTON_LABEL = 'save (URL)';
	const set = gui.addFolder( 'Settings' );
	set.add( settings, 'reset' );
	set.add( settings, 'random' );
	set.add( { [ SAVE_BUTTON_LABEL ]: settings.save }, SAVE_BUTTON_LABEL );
	set.open();

	if ( ! window.sessionStorage ) return;

	const STORAGE_GUI = 'closeGUI';
	const storageGUI = window.sessionStorage.getItem( STORAGE_GUI );
	const closeGUI = ( storageGUI === 'false' ) ? false : true;
	if ( closeGUI ) gui.close();

	function onCloseButton() {

		window.sessionStorage.setItem( STORAGE_GUI, gui.closed );

	}

	gui.__closeButton.addEventListener( 'click', onCloseButton );

};

export { gui };
