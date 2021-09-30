import * as THREE from 'three';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

import varyingUV from './glsl/varyingUV.vert';
import bayerMatrixDither from './glsl/bayerMatrixDither';

class GaussianBlurPass extends ShaderPass {

	constructor(
		{
			direction = 16,
			intensity = 1,
			size = 8,
			quality = 4,

			dither = true,
			resolution,
		} = {}
	) {

		resolution = resolution
            || new THREE.Vector2( window.innerWidth, window.innerHeight );

		super( new THREE.ShaderMaterial( {
			uniforms: {
				tDiffuse   : { value: null },
				uDirection  : { value: direction },
				uIntensity  : { value: intensity },
				uQuality  : { value: quality },
				uResolution: { value: resolution },
				uSize  : { value: size * window.devicePixelRatio },
			},
			vertexShader: varyingUV,
			fragmentShader: GaussianBlurPass.frag
		} ) );

		this.dither = dither;

	}

	setSize( width, height ) {

		this.material.uniforms.uResolution.value = new THREE.Vector2( width, height );


	}

	get dither() {

		return this._dither;

	}

	set dither( value ) {

		let fragmentShader = `${ GaussianBlurPass.frag }`;
		if ( value ) fragmentShader = fragmentShader.replace(
			'//dither//', 'color.xyz = bayerMatrixDither( color.xyz );'
		);
		this.material.fragmentShader = fragmentShader;
		this.material.needsUpdate = true;

		this._dither = value;

	}

	get direction() {

		return this.material.uniforms.uDirection.value;

	}

	set direction( value ) {

		this.material.uniforms.uDirection.value = value;

	}

	get intensity() {

		return this.material.uniforms.uIntensity.value;

	}

	set intensity( value ) {

		this.material.uniforms.uIntensity.value = value;

	}

	get size() {

		return this.material.uniforms.uSize.value;

	}

	set size( value ) {

		this.material.uniforms.uSize.value = value * window.devicePixelRatio;

	}

	get quality() {

		return this.material.uniforms.uQuality.value;

	}

	set quality( value ) {

		this.material.uniforms.uQuality.value = value;

	}

}

GaussianBlurPass.frag = /*glsl*/`
        
    uniform sampler2D tDiffuse;
    uniform vec2 uResolution;
    uniform float uDirection;
	uniform float uIntensity;
    uniform float uQuality;
    uniform float uSize;
    varying vec2 vUv;

    ${ bayerMatrixDither }

    void main() {

        vec2 uv = vUv;
        vec4 color = texture2D( tDiffuse, uv );
		vec4 blur = color;

        // Gaussian Blur Shader
        // by existical - https://www.shadertoy.com/view/Xltfzj
        // edited by Pierre Keda

        const float PI_2 = 6.28318530718; // Pi*2
        float piStep = PI_2 / uDirection;
        float qualityStep = 1.0 / uQuality;
        vec2 radius = uSize / uResolution.xy;
        
        for( float d = 0.0; d < PI_2; d += piStep ) {

            for( float i = qualityStep; i <= 1.0; i += qualityStep ) {

                blur += texture2D(
                    tDiffuse, uv + vec2( cos( d ), sin( d ) ) * radius * i
                );

            }

        }
        
        blur /= uQuality * uDirection - 15.0;

        //

        //dither//
        
        gl_FragColor =  mix( color, blur, uIntensity );

    }

`;

export { GaussianBlurPass };
