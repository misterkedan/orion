import * as dat from 'dat.gui';
import { RenderManager } from './scene/alien/RenderManager';
import { settings } from './settings';

const gui = new dat.GUI();

gui.init = function () {

	const SPEED_CAP = 100;
	const SAVE_LABEL = 'save (to url)';

	const sphere = settings.sphere;

	const plasma = gui.addFolder( 'Plasma Remix' );
	plasma.add( sphere, 'passes', 1, 4 ).step( 1 );
	plasma.add( sphere, 'smoothness', 3, 30 ).step( 1 );
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
	post.add( RenderManager.post.adjustments, 'saturation', 0, 3 ).step( 0.01 );
	post.open();

	const set = gui.addFolder( 'Settings' );
	set.add( settings, 'reset' );
	set.add( settings, 'random' );
	set.add( { [ SAVE_LABEL ]: settings.save }, SAVE_LABEL );
	set.open();

	// Test
	const pixelRatio = window.devicePixelRatio > 2 ? 2 : 1;
	const largeWidth = pixelRatio * 640;
	if ( window.innerWidth < largeWidth ) gui.close();

	//gui.close();

};

export { gui };
