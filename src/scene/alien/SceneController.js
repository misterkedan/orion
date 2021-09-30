class SceneController {

	static init( view ) {

		this.view = view;

	}

	/**
	 * Public methods
	 */

	static resize = ( width, height ) => {

		this.view.resize( width, height );

	};

	static update = () => {



	};

	static animateIn = () => {

		this.view.visible = true;

	};

	static ready = () => this.view.ready();

}

export { SceneController };
