import * as THREE from 'three';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

import varyingUV from '../keda/glsl/varyingUV.vert';
import bayerMatrixDither from '../keda/glsl/bayerMatrixDither';

const FRAG = /*glsl*/`

	uniform sampler2D tDiffuse;
	varying vec2 vUv;

	${ bayerMatrixDither }

	void main() {

		float falloff = 0.25;
		float amount = 1.2;

		vec2 uv = vUv;
		vec4 color = texture2D( tDiffuse, uv );

		float dist = distance(vUv.y, 0.5);

		if ( vUv.y > 0.5 ) {
			amount *= 0.6;
		}

		color.rgb *= smoothstep( 0.8, falloff * 0.799, dist * (amount + falloff) );
		
		// Bayer Matrix Dithering
		color.xyz = bayerMatrixDither( color.xyz );

		gl_FragColor = color;

	}

`;

class CustomVignettePass extends ShaderPass {

	constructor() {

		super( new THREE.ShaderMaterial( {
			uniforms: {
				tDiffuse   : { value: null },
			},
			vertexShader: varyingUV,
			fragmentShader: FRAG
		} ) );

	}

}

export { CustomVignettePass };
