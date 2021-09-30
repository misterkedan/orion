import * as dat from 'dat.gui';

import { App } from './scene/App';
import { RenderManager } from './scene/RenderManager';

//import { config } from './config';

App.init();

const sphere = App.view.sphere;

const gui = new dat.GUI();

const plasma = gui.addFolder( 'Plasma Remix' );
plasma.add( sphere, 'passes', 1, 4 ).step( 1 );
plasma.add( sphere, 'smoothness', 3, 30 );
plasma.add( sphere, 'speed', 1, 100 ).step( 1 );
plasma.open();

const rotation = gui.addFolder( 'Rotation' );
rotation.add( sphere.rotationSpeed, 'x', - 100, 100 ).step( 1 );
rotation.add( sphere.rotationSpeed, 'y', - 100, 100 ).step( 1 );
rotation.add( sphere.rotationSpeed, 'z', - 100, 100 ).step( 1 );
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

const pixelRatio = window.devicePixelRatio > 2 ? 2 : 1;
const largeWidth = pixelRatio * 640;
if ( window.innerWidth < largeWidth ) gui.close();

//gui.close();
