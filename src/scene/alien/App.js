import { Events } from 'alien/config/Events';
import { Stage } from 'alien/controllers/Stage';

import { ticker } from 'alien/tween/Ticker';

import { WorldController } from './WorldController';
import { RenderManager } from './RenderManager';
import { SceneView } from './SceneView';
import { SceneController } from './SceneController';
import { CameraController } from './CameraController';

class App {

	static async init() {

		this.initWorld();
		this.initViews();
		this.initControllers();

		this.addListeners();
		this.onResize();

		await Promise.all( [
			WorldController.textureLoader.ready(),
			SceneController.ready()
		] );

		CameraController.animateIn();
		SceneController.animateIn();

	}

	static initWorld() {

		WorldController.init();
		Stage.add( WorldController.element );

	}

	static initViews() {

		this.view = new SceneView();
		WorldController.scene.add( this.view );

	}

	static initControllers() {

		const { renderer, scene, camera } = WorldController;

		CameraController.init( camera );
		SceneController.init( this.view );
		RenderManager.init( renderer, scene, camera );

	}

	static addListeners() {

		Stage.events.on( Events.RESIZE, this.onResize );
		ticker.add( this.onUpdate );

	}

	/**
	 * Event handlers
	 */

	static onResize = () => {

		const { width, height, dpr } = Stage;

		WorldController.resize( width, height, dpr );
		CameraController.resize( width, height );
		SceneController.resize( width, height );
		RenderManager.resize( width, height, dpr );

	};

	static onUpdate = ( time, delta, frame ) => {

		WorldController.update( time, delta, frame );
		CameraController.update();
		SceneController.update();
		RenderManager.update( time, delta, frame );

		this.view.sphere.update( time );

	};

}

export { App };
