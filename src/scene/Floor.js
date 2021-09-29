import { Group, MathUtils, Mesh, PlaneGeometry, RepeatWrapping } from 'three';
import { Reflector } from 'alien/utils/world/Reflector';
import { ReflectorMaterial } from 'alien/materials/ReflectorMaterial';

import { WorldController } from './WorldController';

class Floor extends Group {

	constructor() {

		super();

		this.initReflector();

	}

	initReflector() {

		this.reflector = new Reflector();

	}

	async initMesh() {

		const { scene, loadTexture } = WorldController;

		const geometry = new PlaneGeometry( 110, 110 );

		//const map = await loadTexture( 'textures/polished_concrete_bright.jpg' );
		const map = await loadTexture( 'textures/polished_concrete_basecolor.jpg' );
		//const map = await loadTexture( 'textures/pitted_metal_basecolor.jpg' );
		map.wrapS = RepeatWrapping;
		map.wrapT = RepeatWrapping;
		map.repeat.set( 16, 16 );

		const { fog } = scene;

		const material = new ReflectorMaterial( {
			map,
			fog,
			dithering: true
		} );

		material.uniforms.tReflect = this.reflector.renderTargetUniform;
		material.uniforms.uMatrix = this.reflector.textureMatrixUniform;

		const mesh = new Mesh( geometry, material );
		mesh.position.y = - 1.7;
		mesh.rotation.x = - Math.PI / 2;
		mesh.add( this.reflector );

		mesh.onBeforeRender = ( renderer, scene, camera ) => {

			this.visible = false;
			this.reflector.update( renderer, scene, camera );
			this.visible = true;

		};

		this.add( mesh );

	}

	/**
	 * Public methods
	 */

	resize( width, height ) {

		width = MathUtils.floorPowerOfTwo( width ) / 2;
		height = 1024;

		this.reflector.setSize( width, height );

	}

}

export { Floor };
