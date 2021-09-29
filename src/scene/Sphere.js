import { Mesh, ShaderMaterial, SphereGeometry, Vector3 } from 'three';
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
				uDisplacement: { value: new Vector3(
					config.displacement.x,
					config.displacement.y,
					config.displacement.z,
				) },
				uPasses: { value: config.passes },
				uSmoothness: { value: config.smoothness },
				uSpeed: { value: config.speed },
				uTime: { value: 0 },
				uValue1: { value: config.value1 },
				uValue2: { value: config.value2 },
			},
		} );

		super( geometry, material );

	}

	update( time ) {

		this.time = time;

		const FACTOR = 0.01;
		this.rotation.x = time * config.rotation.x * FACTOR;
		this.rotation.y = time * config.rotation.y * FACTOR;
		this.rotation.z = time * config.rotation.z * FACTOR;

	}

	invert() {

		const tmp = this.value1;
		this.value1 = this.value2;
		this.value2 = tmp;

	}

	/*-------------------------------------------------------------------------/

		GUI Getters/Setters

	/-------------------------------------------------------------------------*/

	get displacementX() {

		return this.material.uniforms.uDisplacement.value.x;

	}

	set displacementX( value ) {

		this.material.uniforms.uDisplacement.value.x = value;

	}

	get displacementY() {

		return this.material.uniforms.uDisplacement.value.y;

	}

	set displacementY( value ) {

		this.material.uniforms.uDisplacement.value.y = value;

	}

	get displacementZ() {

		return this.material.uniforms.uDisplacement.value.z;

	}

	set displacementZ( value ) {

		this.material.uniforms.uDisplacement.value.z = value;

	}

	get passes() {

		return this.material.uniforms.uPasses.value;

	}

	set passes( passes ) {

		this.material.uniforms.uPasses.value = passes;

	}

	get smoothness() {

		return this.material.uniforms.uSmoothness.value;

	}

	set smoothness( smoothness ) {

		this.material.uniforms.uSmoothness.value = smoothness;

	}

	get speed() {

		return this.material.uniforms.uSpeed.value;

	}

	set speed( speed ) {

		this.material.uniforms.uSpeed.value = speed;

	}

	get time() {

		return this.material.uniforms.uTime.value;

	}

	set time( time ) {

		this.material.uniforms.uTime.value = time;

	}

	get value1() {

		return this.material.uniforms.uValue1.value;

	}

	set value1( value ) {

		this.material.uniforms.uValue1.value = value;

	}

	get value2() {

		return this.material.uniforms.uValue2.value;

	}

	set value2( value ) {

		this.material.uniforms.uValue2.value = value;

	}

}

export { Sphere };
