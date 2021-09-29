import {
	ACESFilmicToneMapping, Color, DirectionalLight, Fog, HemisphereLight,
	PerspectiveCamera, WebGLRenderer, Scene, Uniform, Vector2
} from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

import { TextureLoader } from 'alien/loaders/world/TextureLoader';
import { getFullscreenTriangle } from 'alien/utils/world/Utils3D';

import { config } from '../config';

class WorldController {

	static init() {

		this.initWorld();
		this.initLights();
		this.initLoaders();

		this.addListeners();

	}

	static initWorld() {

		this.renderer = new WebGLRenderer( {
			powerPreference: 'high-performance',
			stencil: false
		} );
		this.element = this.renderer.domElement;

		// Tone mapping
		this.renderer.toneMapping = ACESFilmicToneMapping;
		this.renderer.toneMappingExposure = 1;

		// 3D scene
		this.scene = new Scene();
		this.scene.background = new Color( config.bgColor );
		this.scene.fog = new Fog( config.bgColor, 1, 50 );
		this.camera = new PerspectiveCamera( 30 );
		this.camera.near = 0.5;
		this.camera.far = 50;
		//this.camera.position.z = 0;
		this.camera.lookAt( this.scene.position );

		// Global geometries
		this.screenTriangle = getFullscreenTriangle();

		// Global uniforms
		this.resolution = new Uniform( new Vector2() );
		this.aspect = new Uniform( 1 );
		this.time = new Uniform( 0 );
		this.frame = new Uniform( 0 );

	}

	static initLights() {

		this.scene.add( new HemisphereLight( 0x606060, 0x404040 ) );

		const light = new DirectionalLight( 0xffffff );
		light.position.set( 1, 1, 1 );
		this.scene.add( light );

	}

	static initLoaders() {

		this.textureLoader = new TextureLoader();
		this.svgLoader = new SVGLoader();

	}

	static addListeners() {

		this.renderer.domElement.addEventListener( 'touchstart', this.onTouchStart );

	}

	/**
	 * Event handlers
	 */

	static onTouchStart = e => {

		e.preventDefault();

	};

	/**
	 * Public methods
	 */

	static resize = ( width, height, dpr ) => {

		width = Math.round( width * dpr );
		height = Math.round( height * dpr );

		this.resolution.value.set( width, height );
		this.aspect.value = width / height;

	};

	static update = ( time, delta, frame ) => {

		this.time.value = time;
		this.frame.value = frame;

	};

	static getTexture = ( path, callback ) => this.textureLoader.load( path, callback );

	static loadTexture = path => this.textureLoader.loadAsync( path );

	static loadSVG = path => this.svgLoader.loadAsync( path );

}

export { WorldController };
