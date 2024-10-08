/**
 * @author Kedan
 * Based on https://github.com/spite/Wagner/blob/master/fragment-shaders/vignette-fs.glsl
 */

import * as THREE from 'three';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

import varyingUV from '../glsl/vUv.vert.glsl';
import bayerMatrixDither from '../glsl/functions/bayerMatrixDither.glsl';

class VerticalVignettePass extends ShaderPass {
  /**
   * Vertical only vignette pass.
   * @param { Number } top 		Vignette strength at the top
   * @param { Number } bottom 	Vignette strength at the bottom
   * @param { Number } falloff	Smooth gradient around 0, sharp around 1
   */
  constructor(top = 1, bottom = 1, falloff = 0.5) {
    super(new THREE.ShaderMaterial(VerticalVignettePass.shader));

    const { uniforms } = this.material;
    uniforms.uTop.value = top;
    uniforms.uBottom.value = bottom;
    uniforms.uFalloff.value = falloff;
  }
}

VerticalVignettePass.shader = {
  uniforms: {
    tDiffuse: { value: null },
    uTop: { value: 0 },
    uBottom: { value: 0 },
    uFalloff: { value: 0 },
  },

  vertexShader: varyingUV,

  fragmentShader: /*glsl*/ `
		uniform sampler2D tDiffuse;
		uniform float uTop;
		uniform float uBottom;
		uniform float uFalloff;
		varying vec2 vUv;

		${bayerMatrixDither}

		void main() {

			float falloff = uFalloff;
			float amount = uBottom;
			if ( vUv.y > 0.5 ) amount = uTop;

			vec4 color = texture2D( tDiffuse, vUv );

			float dist = distance(vUv.y, 0.5);
			color.rgb *= smoothstep( 0.8, falloff * 0.799, dist * (amount + falloff) );
			
			color.rgb = bayerMatrixDither( color.rgb );

			gl_FragColor = color;

		}
	`,
};

export { VerticalVignettePass };
