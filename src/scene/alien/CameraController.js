import { Vector2, Vector3 } from 'three';
import { Stage } from 'alien/controllers/Stage';

class CameraController {

	static init( camera ) {

		this.camera = camera;

		this.mouse = new Vector2();
		this.lookAt = new Vector3( 0, 0, 0 );
		this.origin = new Vector3();
		this.target = new Vector3();
		this.targetXY = new Vector2( 5, 1 );
		this.origin.copy( this.camera.position );

		this.lerpSpeed = 0.02;
		this.enabled = false;

		this.addListeners();

	}

	static addListeners() {

		Stage.element.addEventListener( 'pointerdown', this.onPointerDown );
		window.addEventListener( 'pointermove', this.onPointerMove );
		window.addEventListener( 'pointerup', this.onPointerUp );

	}

	/**
	 * Event handlers
	 */

	static onPointerDown = e => {

		this.onPointerMove( e );

	};

	static onPointerMove = ( { clientX, clientY } ) => {

		if ( ! this.enabled ) {

			return;

		}

		this.mouse.x = ( clientX / Stage.width ) * 2 - 1;
		this.mouse.y = 1 - ( clientY / Stage.height ) * 2;

	};

	static onPointerUp = e => {

		this.onPointerMove( e );

	};

	/**
	 * Public methods
	 */

	static resize = ( width, height ) => {

		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();

		if ( width < height ) {

			this.camera.position.z = 14;

		} else {

			this.camera.position.z = 10;

		}

		this.origin.z = this.camera.position.z;

	};

	static update = () => {

		if ( ! this.enabled ) {

			return;

		}

		this.target.x = this.origin.x + this.targetXY.x * this.mouse.x;
		this.target.y = this.origin.y + this.targetXY.y * this.mouse.y;
		this.target.z = this.origin.z;

		this.camera.position.lerp( this.target, this.lerpSpeed );
		this.camera.lookAt( this.lookAt );

	};

	static animateIn = () => {

		this.enabled = true;

	};

}

export { CameraController };
