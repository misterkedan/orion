import { Vector2 } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

import { AdjustmentsPass } from './keda/AdjustmentsPass';
import { FXAAPass } from './keda/FXAAPass';
import { UnrealBloomPass } from './keda/UnrealBloomPass';
import { CustomVignettePass } from './scene/CustomVignettePass';
import { settings } from './settings';

let render;

function init( renderer, scene, camera ) {

	Object.assign( render, { renderer, scene, camera } );

	const { bloom } = settings.current;

	const { innerWidth, innerHeight, devicePixelRatio } = window;
	const width = Math.round( innerWidth / devicePixelRatio );
	const height = Math.round( innerHeight / devicePixelRatio );

	const post = {
		render: new RenderPass( scene, camera ),
		fxaa: new FXAAPass(),
		bloom: new UnrealBloomPass(
			new Vector2( width, height ),
			bloom.strength,
			bloom.radius,
			bloom.threshold
		),
		vignette: new CustomVignettePass(),
		adjustments: new AdjustmentsPass( settings.current.adjustments ),
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

	this.composer.render();

}


render = { init, resize, update };

export { render };
