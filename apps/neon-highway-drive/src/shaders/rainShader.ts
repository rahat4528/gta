export const RainVertexShader = `
  uniform float uTime;
  uniform float uSpeed;
  uniform vec3 uCarPos;
  uniform float uRainIntensity;

  attribute float aSpeed;
  attribute float aLength;
  attribute vec3 aOffset;

  varying float vAlpha;
  varying vec3 vWorldPosition;

  void main() {
    // Rain volume dimensions around car
    vec3 box = vec3(40.0, 25.0, 90.0);
    
    // Slant calculation: speed tilts rain streaks along Z
    float speedRatio = uSpeed / 100.0;
    vec3 velocity = vec3(0.0, -18.0 * aSpeed, 8.0 * speedRatio);

    // Continuous looping position centered around uCarPos
    vec3 pos = aOffset + velocity * uTime;
    
    // Wrap within box around car
    pos.x = mod(pos.x - uCarPos.x + box.x * 0.5, box.x) - box.x * 0.5 + uCarPos.x;
    pos.y = mod(pos.y, box.y);
    pos.z = mod(pos.z - uCarPos.z + box.z * 0.5, box.z) - box.z * 0.5 + uCarPos.z;

    // Stretch line along velocity vector based on speed
    vec3 vertexOffset = position;
    vertexOffset.y *= aLength;
    vertexOffset.z *= (1.0 + speedRatio * 2.5);

    vec4 worldPos = vec4(pos + vertexOffset, 1.0);
    vWorldPosition = worldPos.xyz;
    
    // Fade rain out near camera and at ground
    float distToCar = length(pos.xz - uCarPos.xz);
    vAlpha = smoothstep(box.z * 0.5, 5.0, distToCar) * smoothstep(0.0, 1.0, pos.y) * uRainIntensity;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const RainFragmentShader = `
  uniform vec3 uRainColor;
  varying float vAlpha;

  void main() {
    if (vAlpha <= 0.01) discard;
    gl_FragColor = vec4(uRainColor, vAlpha * 0.5);
  }
`;
