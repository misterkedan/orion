precision highp float;

uniform sampler2D tMap;
uniform sampler2D tReflect;
uniform vec3 uColor;

#ifdef USE_FOG
    uniform vec3 uFogColor;
    uniform float uFogNear;
    uniform float uFogFar;
#endif

in vec2 vUv;
in vec4 vCoord;

out vec4 FragColor;

float blendOverlay(float x, float y) {
    return (x < 0.5) ? (2.0 * x * y) : (1.0 - 2.0 * (1.0 - x) * (1.0 - y));
}

vec4 blendOverlay(vec4 x, vec4 y, float opacity) {
    vec4 z = vec4(blendOverlay(x.r, y.r), blendOverlay(x.g, y.g), blendOverlay(x.b, y.b), blendOverlay(x.a, y.a));
    return z * opacity + x * (1.0 - opacity);
}

float random(vec2 co) {
    float a = 12.9898;
    float b = 78.233;
    float c = 43758.5453;
    float dt = dot(co.xy, vec2(a, b));
    float sn = mod(dt, 3.14);
    return fract(sin(sn) * c);
}

vec3 dither(vec3 color) {
    // Calculate grid position
    float grid_position = random(gl_FragCoord.xy);

    // Shift the individual colors differently, thus making it even harder to see the dithering pattern
    vec3 dither_shift_RGB = vec3(0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0);

    // Modify shift acording to grid position
    dither_shift_RGB = mix(2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position);

    // Shift the color by dither_shift
    return color + dither_shift_RGB;
}

void main() {
    vec4 base = texture(tMap, vUv);
    vec4 blend = textureProj(tReflect, vCoord);

    FragColor = base * blend;

    base = FragColor;
    blend = vec4(uColor, 1.0);

    FragColor = blendOverlay(base, blend, 1.0);

    #ifdef USE_FOG
        float fogDepth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep(uFogNear, uFogFar, fogDepth);

        FragColor.rgb = mix(FragColor.rgb, uFogColor, fogFactor);
    #endif

    #ifdef DITHERING
        FragColor.rgb = dither(FragColor.rgb);
    #endif
}