import { Group } from 'three';
import { Floor } from './Floor';
import { Sphere } from '../Sphere';

class SceneView extends Group {

	constructor() {

		super();

		this.visible = false;

		this.initViews();

	}

	initViews() {

		this.floor = new Floor();
		this.add( this.floor );
		this.floor.position.y = 0.4;

		this.sphere = new Sphere();
		this.add( this.sphere );

		if ( window.innerWidth < window.innerHeight )
			this.sphere.position.z = 2;

	}

	/**
	 * Public methods
	 */

	resize = ( width, height ) => {

		this.floor.resize( width, height );

	};

	ready = () => Promise.all( [
		this.floor.initMesh(),
	] );

}

export { SceneView };
