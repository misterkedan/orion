import { GLSL3, NoBlending, RawShaderMaterial, Uniform } from 'three';
import rgbshift from 'alien/shaders/modules/rgbshift/rgbshift.glsl.js';

const vertexCompositeShader = /* glsl */`
	in vec3 position;
	in vec2 uv;

	out vec2 vUv;

	void main() {
		vUv = uv;

		gl_Position = vec4(position, 1.0);
	}
`;

const fragmentCompositeShader = /* glsl */`
	precision highp float;

	uniform sampler2D tScene;
	uniform sampler2D tBloom;
	uniform float uDistortion;

	in vec2 vUv;

	out vec4 FragColor;

	${rgbshift}

	void main() {
		FragColor = texture(tScene, vUv);

		float angle = length(vUv - 0.5);
		float amount = 0.0002 + uDistortion;

		FragColor.rgb += getRGB(tBloom, vUv, angle, amount).rgb;
	}
`;

class CompositeMaterial extends RawShaderMaterial {

	constructor() {

		super( {
			glslVersion: GLSL3,
			uniforms: {
				tScene: new Uniform( null ),
				tBloom: new Uniform( null ),
				uDistortion: new Uniform( 0.00125 )
			},
			vertexShader: vertexCompositeShader,
			fragmentShader: fragmentCompositeShader,
			blending: NoBlending,
			depthWrite: false,
			depthTest: false
		} );

	}

}

export { CompositeMaterial };
