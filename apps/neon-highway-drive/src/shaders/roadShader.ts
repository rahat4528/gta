import * as THREE from 'three';

export const RoadVertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const RoadFragmentShader = `
  uniform float uTime;
  uniform vec3 uCarPos;
  uniform vec3 uPrimaryNeon;
  uniform vec3 uSecondaryNeon;
  uniform float uRainIntensity;
  uniform float uSpeed;

  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;

  // Pseudo-random noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  // 2D Noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // Animated rain ripple normal distortion
  vec2 getRainRipples(vec2 uv, float t) {
    if (uRainIntensity <= 0.05) return vec2(0.0);
    
    vec2 ripple = vec2(0.0);
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      vec2 gridUv = uv * (12.0 + fi * 8.0);
      vec2 cellId = floor(gridUv);
      vec2 cellUv = fract(gridUv) - 0.5;
      
      float dropTime = fract(t * 1.5 + hash(cellId));
      float dist = length(cellUv);
      
      // Expanding ring wave
      float wave = sin((dist - dropTime * 0.5) * 35.0) * exp(-dropTime * 3.5);
      wave *= smoothstep(0.4, 0.0, dist);
      
      ripple += normalize(cellUv + 0.001) * wave * (0.015 * uRainIntensity);
    }
    return ripple;
  }

  void main() {
    // Road coordinates: X spans across lanes (-14 to +14), Z spans along length
    float x = vWorldPosition.x;
    float z = vWorldPosition.z;

    // Base dark asphalt color
    vec3 asphalt = vec3(0.035, 0.038, 0.045);
    
    // Micro asphalt grain texture
    float grain = noise(vWorldPosition.xz * 4.0) * 0.03;
    asphalt += vec3(grain);

    // Wet puddles mask
    float puddleNoise = noise(vWorldPosition.xz * 0.12);
    float puddleMask = smoothstep(0.45, 0.65, puddleNoise) * uRainIntensity;

    // Normal calculation with rain ripples
    vec2 ripples = getRainRipples(vWorldPosition.xz * 0.5, uTime);
    vec3 normal = normalize(vNormal + vec3(ripples.x, 0.0, ripples.y) * puddleMask * 2.5);

    // Road Markings: 4-lane highway with width ~ 24 units (-12 to +12)
    // Lane dividers at x = -6, 0, +6
    // Outer boundary curbs at x = -11.5, +11.5
    vec3 markingColor = vec3(0.0);
    float markingGlow = 0.0;

    // Outer Neon Curb Strips (Continuous Cyan/Pink Neon Edges)
    float leftCurb = smoothstep(0.3, 0.0, abs(x - (-11.8)));
    float rightCurb = smoothstep(0.3, 0.0, abs(x - 11.8));
    if (leftCurb > 0.0) {
      markingColor += uPrimaryNeon * leftCurb * 2.2;
      markingGlow += leftCurb * 2.0;
    }
    if (rightCurb > 0.0) {
      markingColor += uPrimaryNeon * rightCurb * 2.2;
      markingGlow += rightCurb * 2.0;
    }

    // Lane Dividers (Dashed glowing lines)
    // Dashed pattern along Z: 6m dash, 4m gap = 10m cycle
    float dashPattern = step(0.4, fract(z / 8.0));
    
    // 3 lane lines at -5.9, 0.0, +5.9
    float lane1 = smoothstep(0.12, 0.0, abs(x - (-5.9))) * dashPattern;
    float lane2 = smoothstep(0.12, 0.0, abs(x)) * dashPattern;
    float lane3 = smoothstep(0.12, 0.0, abs(x - 5.9)) * dashPattern;
    
    float centerLanes = lane1 + lane2 + lane3;
    if (centerLanes > 0.0) {
      vec3 dashColor = mix(vec3(0.9, 0.95, 1.0), uPrimaryNeon, 0.4);
      markingColor += dashColor * centerLanes * 1.8;
      markingGlow += centerLanes * 1.5;
    }

    // View direction & Fresnel wet reflection
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float NdotV = max(dot(normal, viewDir), 0.0);
    float fresnel = pow(1.0 - NdotV, 3.5);

    // Wet road reflection of ambient cyberpunk neon sky & roadside neon
    vec3 ambientReflection = mix(uSecondaryNeon * 0.15, uPrimaryNeon * 0.3, fresnel);
    
    // Specular streaks running along the road from neon signs
    float signStreak = sin(x * 0.5 + uTime * 0.2) * 0.5 + 0.5;
    vec3 neonStreakReflection = mix(uPrimaryNeon, uSecondaryNeon, signStreak) * pow(fresnel, 2.0) * 0.45;

    // Combine wet surface
    float wetness = clamp(0.55 + puddleMask * 0.45, 0.0, 1.0);
    vec3 finalColor = asphalt;
    
    // Add road markings
    finalColor = mix(finalColor, markingColor, clamp(markingGlow, 0.0, 1.0));
    
    // Add wet reflections (stronger in puddles and at glancing angles)
    finalColor += (ambientReflection + neonStreakReflection) * wetness * (0.6 + fresnel * 1.2);

    // Car headlight illumination on wet road (car at uCarPos)
    float distToCar = length(vWorldPosition - uCarPos);
    vec3 dirFromCar = normalize(vWorldPosition - uCarPos);
    float forwardAngle = dot(dirFromCar, vec3(0.0, 0.0, -1.0));
    
    if (forwardAngle > 0.5 && distToCar < 45.0 && vWorldPosition.z < uCarPos.z) {
      float coneIntensity = pow(forwardAngle, 8.0) * smoothstep(45.0, 5.0, distToCar);
      // Dual beam headlights: two spots offset from car center
      float beamLeft = smoothstep(1.8, 0.0, abs((vWorldPosition.x - (uCarPos.x - 0.8))));
      float beamRight = smoothstep(1.8, 0.0, abs((vWorldPosition.x - (uCarPos.x + 0.8))));
      float headlightIntensity = coneIntensity * (0.8 + (beamLeft + beamRight) * 0.6);
      
      vec3 headlightColor = vec3(0.9, 0.95, 1.0) * 1.5;
      finalColor += headlightColor * headlightIntensity;
    }

    // Car taillight red reflection behind car
    if (vWorldPosition.z > uCarPos.z && distToCar < 20.0) {
      float tailBeam = smoothstep(20.0, 2.0, distToCar) * smoothstep(2.5, 0.0, abs(vWorldPosition.x - uCarPos.x));
      finalColor += vec3(1.0, 0.05, 0.05) * tailBeam * 1.4 * wetness;
    }

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export function createRoadMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader: RoadVertexShader,
    fragmentShader: RoadFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uCarPos: { value: new THREE.Vector3(0, 0, 0) },
      uPrimaryNeon: { value: new THREE.Color('#00f0ff') },
      uSecondaryNeon: { value: new THREE.Color('#ff007f') },
      uRainIntensity: { value: 0.8 },
      uSpeed: { value: 0 },
    },
  });
}
