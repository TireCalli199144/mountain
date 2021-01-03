uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec4 resolution;

varying vec2 vUv;
varying float vProgress;

void main() {
    // vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
    float dist = length(gl_PointCoord - vec2(0.5));
    float alpha = 1. - smoothstep(0.45,0.5,dist);
    gl_FragColor = vec4(1.,1.,1.,alpha*0.6 + 0.7*vProgress);
}
