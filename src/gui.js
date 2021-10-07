import * as dat from 'dat.gui';

import { config } from './config';
import { render } from './render';
import { settings } from './settings';

const {
	MIN_HUE,
	MAX_HUE,
	MIN_ORB_VALUE,
	MAX_ORB_VALUE,
	MIN_PASSES,
	MAX_PASSES,
	MIN_SATURATION,
	MAX_SATURATION,
	MIN_SMOOTHNESS,
	MAX_SMOOTHNESS,
	MIN_SPEED,
	MAX_SPEED,
	SAVE_BUTTON_LABEL,
	DIGITS
} = config;

const floatStep = 1 / Math.pow( 10, DIGITS );

const gui = new dat.GUI();

gui.init = function () {

	const { orb } = settings;
	const { adjustments } = render.post;

	const main = gui.addFolder( 'Orb' );
	main.add( orb, 'passes', MIN_PASSES, MAX_PASSES ).step( 1 );
	main.add( orb, 'smoothness', MIN_SMOOTHNESS, MAX_SMOOTHNESS ).step( 1 );
	main.add( orb, 'speed', MIN_SPEED, MAX_SPEED ).step( 1 );
	main.open();

	const rotation = gui.addFolder( 'Rotation' );
	rotation.add( orb.rotationSpeed, 'x', - MAX_SPEED, MAX_SPEED ).step( 1 );
	rotation.add( orb.rotationSpeed, 'y', - MAX_SPEED, MAX_SPEED ).step( 1 );
	rotation.add( orb.rotationSpeed, 'z', - MAX_SPEED, MAX_SPEED ).step( 1 );
	rotation.open();

	const color = gui.addFolder( 'Color' );
	color.add( orb, 'value1', MIN_ORB_VALUE, MAX_ORB_VALUE ).step( floatStep )
		.listen();
	color.add( orb, 'value2', MIN_ORB_VALUE, MAX_ORB_VALUE ).step( floatStep )
		.listen();
	color.add( adjustments, 'hue', MIN_HUE, MAX_HUE ).step( floatStep );
	color.add( adjustments, 'saturation', MIN_SATURATION, MAX_SATURATION )
		.step( floatStep );
	color.open();

	const set = gui.addFolder( 'Settings' );
	set.add( settings, 'reset' );
	set.add( settings, 'random' );
	set.add( { [ SAVE_BUTTON_LABEL ]: settings.save }, SAVE_BUTTON_LABEL );
	set.open();

	gui.close();

};

export { gui };
