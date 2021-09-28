uniform float uMix;

varying vec4 vPosition;
varying float vDistance;

float map(float s, float a1, float a2, float b1, float b2) {
    return b1 + (s-a1)*(b2-b1)/(a2-a1);
}

vec3 fog( vec3 color, float near, float far ) {
    return color * smoothstep( far, near, distance(vPosition.xyz, cameraPosition) );
}

// fragment shader
void main()
{
    vec4 colorTop1 = vec4(1.0, 0.3, 0.0, 1.0);
    vec4 colorTop2 = vec4(1.0, 1.0, 1.0, 1.0);
    vec4 colorTop = mix( colorTop1, colorTop2, uMix );

    vec4 colorBottom1 = vec4(1.0, 1.0, 0.8, 1.0);
    vec4 colorBottom2 = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 colorBottom = mix( colorBottom1, colorBottom2, uMix );

    float mappedDistance1 = map(vDistance, 0.91, 1.1, 0.0, 1.0);
    float mappedDistance2 = map(vDistance, 1.0 , 1.1, 0.0, 1.0);
    float mappedDistance = mix ( mappedDistance1, mappedDistance2, uMix );

    vec4 color = mix( colorBottom, colorTop, mappedDistance );

    gl_FragColor = vec4( color );
}