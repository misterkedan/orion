import { Mesh, ShaderMaterial, SphereGeometry } from 'three';
import vShader from 'shaders/sphere.vert.glsl';
import fShader from 'shaders/sphere.frag.glsl';
import { config } from '../config';

class Sphere extends Mesh {

	constructor() {

		const geometry = new SphereGeometry( 1, 256, 256 );

		const material = new ShaderMaterial( {
			vertexShader: vShader,
			fragmentShader: fShader,
			uniforms: {
				uTime: { value: 0 },
				uDuration: { value: config.loopDuration },
				uMix: { value: 1 }
			},
		} );

		super( geometry, material );

		this.rotation.z = 90 * Math.PI / 2;

	}

	update( time ) {

		this.material.uniforms.uTime.value = time;
		this.rotation.y = time * Math.PI / 2 * 0.01 * config.rotationSpeed;

	}

}

export { Sphere };
