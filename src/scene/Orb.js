import { Mesh, ShaderMaterial, SphereGeometry } from 'three';
import vertexShader from '../shaders/Orb.vert.glsl';
import fragmentShader from '../shaders/Orb.frag.glsl';
import { settings } from '../settings';

class Orb extends Mesh {

	constructor( segments ) {

		const {
			passes, smoothness, speed, value1, value2, rotationSpeed
		} = settings.current.orb;

		const geometry = new SphereGeometry( 1, segments, segments );

		const material = new ShaderMaterial( {
			vertexShader,
			fragmentShader,
			uniforms: {
				uPasses: { value: passes },
				uSmoothness: { value: smoothness },
				uSpeed: { value: speed },
				uTime: { value: 0 },
				uValue1: { value: value1 },
				uValue2: { value: value2 },
			},
		} );

		super( geometry, material );

		this.rotationSpeed = { ...rotationSpeed };

	}

	update( time ) {

		let { rotation, rotationSpeed } = this;

		const FACTOR = 0.01;
		time /= 1000;

		rotation.x = time * rotationSpeed.x * FACTOR;
		rotation.y = time * rotationSpeed.y * FACTOR;
		rotation.z = time * rotationSpeed.z * FACTOR;

		this.time = time;

	}

	invert() {

		let { value1, value2 } = this;
		const tmp = value1;

		value1 = value2;
		value2 = tmp;

	}

	/*-------------------------------------------------------------------------/

		GUI Getters/Setters

	/-------------------------------------------------------------------------*/

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

export { Orb };
