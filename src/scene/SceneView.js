import { Group } from 'three';
import { Floor } from './Floor';
import { Sphere } from './Sphere';
//import { Triangle } from './Triangle';

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

		//this.triangle = new Triangle();
		//this.add( this.triangle );

	}

	/**
	 * Public methods
	 */

	resize = ( width, height ) => {

		this.floor.resize( width, height );

	};

	ready = () => Promise.all( [
		this.floor.initMesh(),
		//this.triangle.initMesh()
	] );

}

export { SceneView };
