import {
	MathUtils, Mesh, OrthographicCamera, RGBFormat, Scene, Vector2,
	WebGLRenderTarget,
} from 'three';

import { FXAAMaterial } from 'alien/materials/FXAAMaterial';
import { LuminosityMaterial } from 'alien/materials/LuminosityMaterial';
import { BloomCompositeMaterial } from 'alien/materials/BloomCompositeMaterial';
import { UnrealBloomBlurMaterial } from 'alien/materials/UnrealBloomBlurMaterial';
import { mix } from 'alien/utils/Utils';

import { CompositeMaterial } from './CompositeMaterial';
import { WorldController } from './WorldController';

import { config } from 'root/config';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { AdjustmentsPass } from 'keda/AdjustmentsPass';
import { CustomVignettePass } from '../CustomVignettePass';

const BlurDirectionX = new Vector2( 1, 0 );
const BlurDirectionY = new Vector2( 0, 1 );

class RenderManager {

	static init( renderer, scene, camera ) {

		this.renderer = renderer;
		this.scene = scene;
		this.camera = camera;

		Object.assign( this, config.bloom );
		this.enabled = true;

		this.initRenderer();
		this.initComposer();

	}

	static initComposer() {

		const { screenScene, screenCamera, renderer } = this;

		const post = {
			render: new RenderPass( screenScene, screenCamera ),
			gradient: new CustomVignettePass(),
			adjustments: new AdjustmentsPass( config.adjustments ),
		};

		const composer = new EffectComposer( renderer );

		Object.values( post ).forEach( pass => composer.addPass( pass ) );
		Object.assign( this, { post, composer } );

	}

	static initRenderer() {

		const { screenTriangle, resolution } = WorldController;

		// Fullscreen triangle
		this.screenScene = new Scene();
		this.screenCamera = new OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );

		this.screen = new Mesh( screenTriangle );
		this.screen.frustumCulled = false;
		this.screenScene.add( this.screen );

		// Render targets
		this.renderTargetA = new WebGLRenderTarget( 1, 1, {
			format: RGBFormat,
			depthBuffer: false
		} );

		this.renderTargetB = this.renderTargetA.clone();

		this.renderTargetsHorizontal = [];
		this.renderTargetsVertical = [];
		this.nMips = 5;

		this.renderTargetBright = this.renderTargetA.clone();

		for ( let i = 0, l = this.nMips; i < l; i ++ ) {

			this.renderTargetsHorizontal.push( this.renderTargetA.clone() );
			this.renderTargetsVertical.push( this.renderTargetA.clone() );

		}

		this.renderTargetA.depthBuffer = true;

		// FXAA material
		this.fxaaMaterial = new FXAAMaterial();
		this.fxaaMaterial.uniforms.uResolution = resolution;

		// Luminosity high pass material
		this.luminosityMaterial = new LuminosityMaterial();
		this.luminosityMaterial.uniforms.uLuminosityThreshold.value = this.luminosityThreshold;

		// Gaussian blur materials
		this.blurMaterials = [];

		const kernelSizeArray = [ 3, 5, 7, 9, 11 ];

		for ( let i = 0, l = this.nMips; i < l; i ++ ) {

			this.blurMaterials.push( new UnrealBloomBlurMaterial( kernelSizeArray[ i ] ) );
			this.blurMaterials[ i ].uniforms.uResolution.value = new Vector2();

		}

		// Bloom composite material
		const bloomFactors = [ 1, 0.8, 0.6, 0.4, 0.2 ];

		for ( let i = 0, l = this.nMips; i < l; i ++ ) {

			const factor = bloomFactors[ i ];
			bloomFactors[ i ] = this.bloomStrength * mix( factor, 1.2 - factor, this.bloomRadius );

		}

		this.bloomCompositeMaterial = new BloomCompositeMaterial( this.nMips );
		this.bloomCompositeMaterial.uniforms.tBlur1.value = this.renderTargetsVertical[ 0 ].texture;
		this.bloomCompositeMaterial.uniforms.tBlur2.value = this.renderTargetsVertical[ 1 ].texture;
		this.bloomCompositeMaterial.uniforms.tBlur3.value = this.renderTargetsVertical[ 2 ].texture;
		this.bloomCompositeMaterial.uniforms.tBlur4.value = this.renderTargetsVertical[ 3 ].texture;
		this.bloomCompositeMaterial.uniforms.tBlur5.value = this.renderTargetsVertical[ 4 ].texture;
		this.bloomCompositeMaterial.uniforms.uBloomFactors.value = bloomFactors;

		// Composite material
		this.compositeMaterial = new CompositeMaterial();

	}

	/**
	 * Public methods
	 */

	static resize = ( width, height, dpr ) => {

		this.renderer.setPixelRatio( dpr );
		this.renderer.setSize( width, height );
		this.composer.setSize( width, height );

		width = Math.round( width * dpr );
		height = Math.round( height * dpr );

		this.renderTargetA.setSize( width, height );
		this.renderTargetB.setSize( width, height );

		width = MathUtils.floorPowerOfTwo( width ) / 2;
		height = MathUtils.floorPowerOfTwo( height ) / 2;

		this.renderTargetBright.setSize( width, height );

		for ( let i = 0, l = this.nMips; i < l; i ++ ) {

			this.renderTargetsHorizontal[ i ].setSize( width, height );
			this.renderTargetsVertical[ i ].setSize( width, height );

			this.blurMaterials[ i ].uniforms.uResolution.value.set( width, height );

			width = width / 2;
			height = height / 2;

		}

	};

	static update = () => {

		const renderer = this.renderer;
		const scene = this.scene;
		const camera = this.camera;

		if ( ! this.enabled ) {

			renderer.setRenderTarget( null );
			renderer.render( scene, camera );
			return;

		}

		const screenScene = this.screenScene;
		const screenCamera = this.screenCamera;

		const renderTargetA = this.renderTargetA;
		const renderTargetB = this.renderTargetB;
		const renderTargetBright = this.renderTargetBright;
		const renderTargetsHorizontal = this.renderTargetsHorizontal;
		const renderTargetsVertical = this.renderTargetsVertical;

		// Scene pass
		renderer.setRenderTarget( renderTargetA );
		renderer.render( scene, camera );

		// FXAA pass
		this.fxaaMaterial.uniforms.tMap.value = renderTargetA.texture;
		this.screen.material = this.fxaaMaterial;
		renderer.setRenderTarget( renderTargetB );
		renderer.render( screenScene, screenCamera );

		// Extract bright areas
		this.luminosityMaterial.uniforms.tMap.value = renderTargetB.texture;
		this.screen.material = this.luminosityMaterial;
		renderer.setRenderTarget( renderTargetBright );
		renderer.render( screenScene, screenCamera );

		// Blur all the mips progressively
		let inputRenderTarget = renderTargetBright;

		for ( let i = 0, l = this.nMips; i < l; i ++ ) {

			this.screen.material = this.blurMaterials[ i ];

			this.blurMaterials[ i ].uniforms.tMap.value = inputRenderTarget.texture;
			this.blurMaterials[ i ].uniforms.uDirection.value = BlurDirectionX;
			renderer.setRenderTarget( renderTargetsHorizontal[ i ] );
			renderer.render( screenScene, screenCamera );

			this.blurMaterials[ i ].uniforms.tMap.value = this.renderTargetsHorizontal[ i ].texture;
			this.blurMaterials[ i ].uniforms.uDirection.value = BlurDirectionY;
			renderer.setRenderTarget( renderTargetsVertical[ i ] );
			renderer.render( screenScene, screenCamera );

			inputRenderTarget = renderTargetsVertical[ i ];

		}

		// Composite all the mips
		this.screen.material = this.bloomCompositeMaterial;
		renderer.setRenderTarget( renderTargetsHorizontal[ 0 ] );
		renderer.render( screenScene, screenCamera );

		// Composite pass (render to screen)
		this.compositeMaterial.uniforms.tScene.value = renderTargetB.texture;
		this.compositeMaterial.uniforms.tBloom.value = renderTargetsHorizontal[ 0 ].texture;
		this.screen.material = this.compositeMaterial;
		renderer.setRenderTarget( null );
		renderer.render( screenScene, screenCamera );

		this.composer.render();

	};

}

export { RenderManager };
