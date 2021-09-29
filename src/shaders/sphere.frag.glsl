uniform float uMix;

varying vec4 vPosition;
varying float vDistance;

float map(float s, float a1, float a2, float b1, float b2) {
    return b1 + (s-a1)*(b2-b1)/(a2-a1);
}

// fragment shader
void main()
{

    vec4 color1 = vec4( 0.7, 0.7, 0.7, 1.0 );
	vec4 color2 = vec4( 0.9, 0.9, 0.9, 1.0 );
    float distanceMap = map(vDistance, 1.0 , 1.1, 0.0, 1.0);

    vec4 color = mix( color1, color2, distanceMap );

    gl_FragColor = vec4( color );
}