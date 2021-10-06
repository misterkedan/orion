import { Vector2 } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

import { AdjustmentsPass } from './postprocessing/AdjustmentsPass';
import { FXAAPass } from './postprocessing/FXAAPass';
import { DitheredUnrealBloomPass } from './postprocessing/DitheredUnrealBloomPass';
import { VerticalVignettePass } from './postprocessing/VerticalVignettePass';

import { settings } from './settings';

let render;

function init( renderer, scene, camera ) {

	Object.assign( render, { renderer, scene, camera } );

	const { innerWidth, innerHeight, devicePixelRatio } = window;
	const width = Math.round( innerWidth / devicePixelRatio );
	const height = Math.round( innerHeight / devicePixelRatio );
	const { bloom, adjustments } = settings.current;

	const post = {
		render: new RenderPass( scene, camera ),
		fxaa: new FXAAPass(),
		bloom: new DitheredUnrealBloomPass(
			new Vector2( width, height ),
			bloom.strength,
			bloom.radius,
			bloom.threshold
		),
		vignette: new VerticalVignettePass( 0.72, 1.2, 0.25 ),
		adjustments: new AdjustmentsPass( adjustments ),
	};

	const composer = new EffectComposer( renderer );

	Object.values( post ).forEach( pass => composer.addPass( pass )	);
	Object.assign( render, { composer, post } );

}

function resize( width, height, devicePixelRatio ) {

	const { composer, post } = render;

	composer.setSize( width, height );

	Object.values( post ).forEach( pass => {

		if ( pass.setSize ) pass.setSize( width, height, devicePixelRatio );

	} );

}

function update() {

	render.composer.render();

}

render = { init, resize, update };

export { render };
