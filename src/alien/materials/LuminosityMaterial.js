import { GLSL3, NoBlending, RawShaderMaterial, Uniform } from 'three';

import vertexShader from '../shaders/LuminosityPass.vert.js';
import fragmentShader from '../shaders/LuminosityPass.frag.js';

export class LuminosityMaterial extends RawShaderMaterial {

	constructor() {

		super( {
			glslVersion: GLSL3,
			uniforms: {
				tMap: new Uniform( null ),
				uLuminosityThreshold: new Uniform( 1 ),
				uLuminositySmoothing: new Uniform( 1 )
			},
			vertexShader,
			fragmentShader,
			blending: NoBlending,
			depthWrite: false,
			depthTest: false
		} );

	}

}
