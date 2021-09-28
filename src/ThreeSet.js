import * as THREE from 'three';
import {
	VignetteEffect, TextureEffect, DepthOfFieldEffect, BloomEffect, SMAAEffect,
	SMAAPreset, EffectComposer, EffectPass, RenderPass, BlendFunction
} from 'postprocessing';

class ThreeSet {

	constructor( canvas ) {

		this.canvas = canvas;
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000 );
		this.renderer = new THREE.WebGLRenderer( {
			canvas: this.canvas,
			//powerPreference: 'high-performance',
			antialias: false,
			//stencil: false,
			//depth: false
		} );
		this.renderer.setClearColor( 0x000000 );
		this.composer = new EffectComposer( this.renderer );

	}

	init( smaaSearch, smaaArea, debug ) {

		this.renderPass = new RenderPass( this.scene, this.camera );

		let dofEffect = new DepthOfFieldEffect( this.camera, {
			focusDistance: .004,
			focalLength: .01,
			bokehScale: 2
		} );

		//dofEffect.target = new THREE.Vector3(0,0,0);

		this.effectPass = new EffectPass( this.camera,
			//dofEffect,
			new BloomEffect( {
				intensity: .6,
				luminanceThreshold: .45
			} ),
			new VignetteEffect( {
				offset: .5,
				darkness: 1
			} )
		);
		this.smaaPass = new EffectPass(
			this.camera,
			new SMAAEffect( smaaSearch, smaaArea, SMAAPreset.ULTRA )
		);

		this.composer.addPass( this.renderPass );
		this.composer.addPass( this.effectPass );
		//this.composer.addPass( this.smaaPass );

		window.addEventListener( 'resize', this.setSize.bind( this ) );
		this.setSize();

		if ( debug ) {

			let cocTextureEffect = new TextureEffect( {
				blendFunction: BlendFunction.SKIP,
				texture: dofEffect.renderTargetCoC.texture
			} );
			this.composer.addPass( new EffectPass( this.camera, cocTextureEffect ) );

			let blendSwitch = false;
			window.addEventListener( 'keydown', ev => {

				if ( ev.key == ' ' ) {

					blendSwitch = ! blendSwitch;
					cocTextureEffect.blendMode.setBlendFunction( blendSwitch ? BlendFunction.NORMAL : BlendFunction.SKIP );

				}

			} );

			window.cocMaterial = dofEffect.circleOfConfusionMaterial;
			// use this in the console:
			// cocMaterial.uniforms.focusDistance.value = .03;
			// cocMaterial.uniforms.focalLength.value = .01;

		}

	}

	setSize() {

		const { canvas, composer, camera } = this;

		const width = window.innerWidth;
		const height = window.innerHeight;

		canvas.width = width;
		canvas.height = height;
		composer.setSize( width, height );
		camera.aspect = width / height;
		camera.updateProjectionMatrix();

	}

}

export { ThreeSet };
