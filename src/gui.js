import * as dat from 'dat.gui';

import { render } from './render';
import { settings } from './settings';

const gui = new dat.GUI();

gui.init = function () {

	const orb = settings.orb;

	const SPEED_CAP = 100;
	const main = gui.addFolder( 'Orb' );
	main.add( orb, 'passes', 1, 4 ).step( 1 );
	main.add( orb, 'smoothness', 3, 30 ).step( 1 );
	main.add( orb, 'speed', 1, SPEED_CAP ).step( 1 );
	main.open();

	const rotation = gui.addFolder( 'Rotation' );
	rotation.add( orb.rotationSpeed, 'x', - SPEED_CAP, SPEED_CAP ).step( 1 );
	rotation.add( orb.rotationSpeed, 'y', - SPEED_CAP, SPEED_CAP ).step( 1 );
	rotation.add( orb.rotationSpeed, 'z', - SPEED_CAP, SPEED_CAP ).step( 1 );
	rotation.open();

	const color = gui.addFolder( 'Color' );
	color.add( orb, 'value1', 0, 1 ).step( 0.01 ).listen();
	color.add( orb, 'value2', 0, 1 ).step( 0.01 ).listen();
	color.add( render.post.adjustments, 'hue', 0, Math.PI * 2 ).step( 0.01 );
	color.add( render.post.adjustments, 'saturation', 0, 3 ).step( 0.01 );
	color.open();

	const SAVE_LABEL = 'save (URL)';
	const set = gui.addFolder( 'Settings' );
	set.add( settings, 'reset' );
	set.add( settings, 'random' );
	set.add( { [ SAVE_LABEL ]: settings.save }, SAVE_LABEL );
	set.open();

	gui.close();

};

export { gui };
