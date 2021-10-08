import { ACESFilmicToneMapping, Vector2, WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

import { AdjustmentsPass } from './postprocessing/AdjustmentsPass';
import { DitheredUnrealBloomPass } from './postprocessing/DitheredUnrealBloomPass';
import { FXAAPass } from './postprocessing/FXAAPass';
import { VerticalVignettePass } from './postprocessing/VerticalVignettePass';
import { stage } from './stage';
import { settings } from './settings';

let render;
let post;

const renderer = new WebGLRenderer( {
	powerPreference: 'high-performance',
	stencil: false,
} );
renderer.toneMapping = ACESFilmicToneMapping;

const canvas = renderer.domElement;
document.getElementById( 'main' ).appendChild( canvas );

const composer = new EffectComposer( renderer );

function init() {

	const { innerWidth, innerHeight, devicePixelRatio } = window;
	const width = Math.round( innerWidth / devicePixelRatio );
	const height = Math.round( innerHeight / devicePixelRatio );
	const { bloom, adjustments } = settings.current;
	const { scene, camera } = stage;

	post = {
		render: new RenderPass( scene, camera ),
		fxaa: new FXAAPass(),
		bloom: new DitheredUnrealBloomPass(
			new Vector2( width, height ),
			bloom.strength,
			bloom.radius,
			bloom.threshold
		),
		vignette: new VerticalVignettePass( 0.7, 1.2, 0.25 ),
		adjustments: new AdjustmentsPass( adjustments ),
	};

	Object.values( post ).forEach( pass => composer.addPass( pass )	);

	render.post = post;

}

function resize( width, height, devicePixelRatio ) {

	renderer.setPixelRatio( devicePixelRatio );
	renderer.setSize( width, height );
	composer.setSize( width, height );

	Object.values( post ).forEach( pass => {

		if ( pass.setSize ) pass.setSize( width, height, devicePixelRatio );

	} );

}

function update() {

	composer.render();

}

render = { renderer, canvas, composer, init, resize, update };

export { render };
