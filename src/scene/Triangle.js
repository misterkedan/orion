import { Group, Mesh, MeshStandardMaterial } from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { WorldController } from './WorldController';

// https://vimeo.com/69949278

class Triangle extends Group {

	constructor() {

		super();

	}

	async initMesh() {

		const { camera, loadSVG } = WorldController;

		const data = await loadSVG( 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><path stroke-width="0.3" d="M3 0L0 5h6z"/></svg>' );
		const paths = data.paths;

		const group = new Group();
		group.position.set( 0, 1.4, - 11 );
		group.scale.y *= - 1;
		group.lookAt( camera.position );

		for ( let i = 0, l = paths.length; i < l; i ++ ) {

			const path = paths[ i ];

			const material = new MeshStandardMaterial( { emissive: 0xffffff } );

			for ( let j = 0, jl = path.subPaths.length; j < jl; j ++ ) {

				const subPath = path.subPaths[ j ];
				const geometry = SVGLoader.pointsToStroke( subPath.getPoints(), path.userData.style );

				if ( geometry ) {

					geometry.center();

					const mesh = new Mesh( geometry, material );
					group.add( mesh );

				}

			}

		}

		this.add( group );

	}

}

export { Triangle };
