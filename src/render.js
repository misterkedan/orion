import { Vector2 } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

import { AdjustmentsPass } from './postprocessing/AdjustmentsPass';
import { DitheredUnrealBloomPass } from './postprocessing/DitheredUnrealBloomPass';
import { FXAAPass } from './postprocessing/FXAAPass';
import { VerticalVignettePass } from './postprocessing/VerticalVignettePass';

import { config } from './config';
import { settings } from './settings';

const { VIGNETTE_TOP, VIGNETTE_BOTTOM, VIGNETTE_FALLOFF } = config;

let render;
let composer;
let post;

function init( renderer, scene, camera ) {

	const { innerWidth, innerHeight, devicePixelRatio } = window;
	const width = Math.round( innerWidth / devicePixelRatio );
	const height = Math.round( innerHeight / devicePixelRatio );
	const { bloom, adjustments } = settings.current;

	post = {
		render: new RenderPass( scene, camera ),
		fxaa: new FXAAPass(),
		bloom: new DitheredUnrealBloomPass(
			new Vector2( width, height ),
			bloom.strength,
			bloom.radius,
			bloom.threshold
		),
		vignette: new VerticalVignettePass(
			VIGNETTE_TOP,
			VIGNETTE_BOTTOM,
			VIGNETTE_FALLOFF
		),
		adjustments: new AdjustmentsPass( adjustments ),
	};

	composer = new EffectComposer( renderer );

	Object.values( post ).forEach( pass => composer.addPass( pass )	);

	Object.assign( render, { renderer, scene, camera, post, composer } );

}

function resize( width, height, devicePixelRatio ) {

	composer.setSize( width, height );

	Object.values( post ).forEach( pass => {

		if ( pass.setSize ) pass.setSize( width, height, devicePixelRatio );

	} );

}

function update() {

	composer.render();

}

render = { init, resize, update };

export { render };
