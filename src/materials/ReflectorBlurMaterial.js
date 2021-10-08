/**
 * @author pschroen / https://ufo.ai/
 */

import { GLSL3, NoBlending, RawShaderMaterial, Uniform, Vector2 } from 'three';

import vertexShader from '../glsl/ReflectorBlurPass.vert.glsl';
import fragmentShader from '../glsl/ReflectorBlurPass.frag.glsl';

export class ReflectorBlurMaterial extends RawShaderMaterial {

	constructor() {

		super( {
			glslVersion: GLSL3,
			uniforms: {
				tMap: new Uniform( null ),
				uBluriness: new Uniform( 1 ),
				uDirection: new Uniform( new Vector2( 1, 0 ) ),
				uResolution: new Uniform( new Vector2() )
			},
			vertexShader,
			fragmentShader,
			blending: NoBlending,
			depthWrite: false,
			depthTest: false
		} );

	}

}
