import { Group, MathUtils, Mesh, PlaneGeometry, RepeatWrapping } from 'three';
import { Reflector } from './Reflector';
import { ReflectorMaterial } from '../materials/ReflectorMaterial';

class Floor extends Group {

	constructor() {

		super();

		this.reflector = new Reflector();

	}

	init( map, scene ) {

		const geometry = new PlaneGeometry( 110, 110 );

		if ( map ) {

			map.wrapS = RepeatWrapping;
			map.wrapT = RepeatWrapping;
			map.repeat.set( 16, 16 );

		}

		const { fog } = scene;

		const material = new ReflectorMaterial( {
			map,
			fog,
			dithering: true
		} );

		material.uniforms.tReflect = this.reflector.renderTargetUniform;
		material.uniforms.uMatrix = this.reflector.textureMatrixUniform;

		const mesh = new Mesh( geometry, material );
		mesh.rotation.x = - Math.PI / 2;
		mesh.add( this.reflector );

		mesh.onBeforeRender = ( renderer, scene, camera ) => {

			this.visible = false;
			this.reflector.update( renderer, scene, camera );
			this.visible = true;

		};

		this.add( mesh );

	}

	resize( width, height, devicePixelRatio ) {

		width = Math.round( width / devicePixelRatio );
		height = Math.round( height / devicePixelRatio );

		width = MathUtils.floorPowerOfTwo( width ) / 2;
		height = 1024;

		this.reflector.setSize( width, height );

	}

}

export { Floor };
