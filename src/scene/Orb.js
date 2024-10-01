/**
 * @authors Thibka & Kedan
 */
import { Mesh, ShaderMaterial, SphereGeometry } from 'three';

import vertexShader from '../glsl/Orb.vert.glsl';
import fragmentShader from '../glsl/Orb.frag.glsl';
import { settings } from '../settings';

class Orb extends Mesh {

	constructor() {

		const { passes, smoothness, speed, value1, value2, rotationSpeed } =
      settings.current.orb;

		const SEGMENTS = 320;
		const geometry = new SphereGeometry( 1, SEGMENTS, SEGMENTS );

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

		const { rotation, rotationSpeed } = this;

		const MULTIPLIER = 0.01;

		time /= 1000;

		rotation.x = time * rotationSpeed.x * MULTIPLIER;
		rotation.y = time * rotationSpeed.y * MULTIPLIER;
		rotation.z = time * rotationSpeed.z * MULTIPLIER;

		this.time = time;

	}

	invert() {

		let { value1, value2 } = this;
		const tmp = value1;

		value1 = value2;
		value2 = tmp;

	}

	/*eslint-disable*/
  get passes() {
    return this.material.uniforms.uPasses.value;
  }
  get smoothness() {
    return this.material.uniforms.uSmoothness.value;
  }
  get speed() {
    return this.material.uniforms.uSpeed.value;
  }
  get time() {
    return this.material.uniforms.uTime.value;
  }
  get value1() {
    return this.material.uniforms.uValue1.value;
  }
  get value2() {
    return this.material.uniforms.uValue2.value;
  }

  set passes(value) {
    this.material.uniforms.uPasses.value = value;
  }
  set smoothness(value) {
    this.material.uniforms.uSmoothness.value = value;
  }
  set speed(value) {
    this.material.uniforms.uSpeed.value = value;
  }
  set time(value) {
    this.material.uniforms.uTime.value = value;
  }
  set value1(value) {
    this.material.uniforms.uValue1.value = value;
  }
  set value2(value) {
    this.material.uniforms.uValue2.value = value;
  }
  /*eslint-enable*/

}

export { Orb };
