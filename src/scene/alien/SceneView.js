import { Group } from 'three';
import { Floor } from './Floor';
import { Orb } from '../Orb';

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

		this.orb = new Orb();
		this.add( this.orb );

		if ( window.innerWidth < window.innerHeight )
			this.orb.position.z = 2;

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
