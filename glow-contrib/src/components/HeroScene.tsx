import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Html, useTexture, Billboard } from '@react-three/drei';
import * as THREE from 'three';

// removed unused NeonLayeredMaterial to avoid linter warnings

function Moon({ scale = 1.9 }: { scale?: number }) {
  const moonRef = useRef<THREE.Mesh>(null);
  // Moon textures (swap with higher-res 4K/8K URLs if available)
  const MOON_COLOR_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg';
  const MOON_BUMP_URL = MOON_COLOR_URL;
  const [colorMap, bumpMap] = useTexture([MOON_COLOR_URL, MOON_BUMP_URL]);

  useMemo(() => {
    colorMap.anisotropy = 16;
    bumpMap.anisotropy = 16;
  }, [colorMap, bumpMap]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (moonRef.current) {
      moonRef.current.rotation.y = t * 0.07;
      moonRef.current.rotation.x = Math.sin(t * 0.25) * 0.03;
    }
  });

  return (
    <group>
      {/* Moon */}
      <mesh ref={moonRef} scale={scale} castShadow receiveShadow>
        <sphereGeometry args={[1, 192, 192]} />
        <meshStandardMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.045}
          metalness={0.05}
          roughness={0.95}
        />
      </mesh>

      {/* Neon rim / atmosphere glow */}
      <mesh scale={scale * 1.06}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color={new THREE.Color('#7c3aed')}
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Accent halo ring */}
      <mesh scale={scale * 2.15} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.55, 2.08, 128]} />
        <meshBasicMaterial color={new THREE.Color('#22d3ee')} transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

// Neon SVG textures for orbiting badges (data URIs so no network needed)
const btcSvg = `data:image/svg+xml;utf8,
  <svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'>
    <defs>
      <radialGradient id='g' cx='50%' cy='40%' r='60%'>
        <stop offset='0%' stop-color='%23ffd166'/>
        <stop offset='70%' stop-color='%23ff8c00'/>
        <stop offset='100%' stop-color='transparent'/>
      </radialGradient>
      <filter id='glow' x='-40%' y='-40%' width='180%' height='180%'>
        <feGaussianBlur stdDeviation='6' result='b'/>
        <feMerge><feMergeNode in='b'/><feMergeNode in='SourceGraphic'/></feMerge>
      </filter>
    </defs>
    <circle cx='128' cy='128' r='112' fill='url(%23g)'/>
    <circle cx='128' cy='128' r='98' fill='none' stroke='%23ffd166' stroke-width='3' opacity='0.5'/>
    <g filter='url(%23glow)'>
      <text x='50%' y='58%' font-family='Arial,Helvetica,sans-serif' font-size='120' text-anchor='middle' fill='white'>₿</text>
    </g>
  </svg>`;

const ethSvg = `data:image/svg+xml;utf8,
  <svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'>
    <defs>
      <radialGradient id='g' cx='50%' cy='40%' r='60%'>
        <stop offset='0%' stop-color='%23a78bfa'/>
        <stop offset='70%' stop-color='%237c3aed'/>
        <stop offset='100%' stop-color='transparent'/>
      </radialGradient>
      <filter id='glow' x='-40%' y='-40%' width='180%' height='180%'>
        <feGaussianBlur stdDeviation='6' result='b'/>
        <feMerge><feMergeNode in='b'/><feMergeNode in='SourceGraphic'/></feMerge>
      </filter>
    </defs>
    <circle cx='128' cy='128' r='112' fill='url(%23g)'/>
    <circle cx='128' cy='128' r='98' fill='none' stroke='%23a78bfa' stroke-width='3' opacity='0.5'/>
    <g filter='url(%23glow)'>
      <path d='M128 36l56 92-56 32-56-32 56-92zm0 184l56-80-56 32-56-32 56 80z' fill='white'/>
    </g>
  </svg>`;

function OrbitBadge({ radius, speed, size = 0.42, texture }: { radius: number; speed: number; size?: number; texture: string }) {
  const ref = useRef<THREE.Group>(null);
  const map = useTexture(texture);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed;
    ref.current.rotation.y = t;
  });
  return (
    <group ref={ref}>
      <Billboard position={[radius, 0, 0]}>
        <mesh>
          <planeGeometry args={[size, size]} />
          <meshBasicMaterial map={map} transparent opacity={0.95} blending={THREE.AdditiveBlending} />
        </mesh>
      </Billboard>
    </group>
  );
}

function OrbitRing({ radius, speed, tilt, color, thickness = 0.025 }: { radius: number; speed: number; tilt: [number, number, number]; color: string; thickness?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed;
      ref.current.rotation.z = Math.sin(t * 0.6) * 0.25 + tilt[2];
      ref.current.rotation.x = tilt[0];
      ref.current.rotation.y = tilt[1] + t * 0.28;
    }
  });

  return (
    <group ref={ref}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, thickness, 32, 256]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function SparkCloud({ count = 220, radius = 4.2 }: { count?: number; radius?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radius * (0.35 + Math.random() * 0.65);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      arr.set([x, y, z], i * 3);
    }
    return arr;
  }, [count, radius]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.03,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: new THREE.Color('#bfefff'),
    });
  }, []);

  useFrame(({ clock, scene }) => {
    const pts = scene.getObjectByName('sparkCloud') as THREE.Points | null;
    if (pts) pts.rotation.y = clock.getElapsedTime() * 0.03;
  });

  return (
    <points name="sparkCloud">
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <primitive object={material} attach="material" />
    </points>
  );
}

function CursorParallax({ children, strength = 0.18 }: { children: React.ReactNode; strength?: number }) {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  useFrame(({ pointer, clock }) => {
    if (!group.current) return;
    const tx = THREE.MathUtils.lerp(group.current.position.x, pointer.x * strength * (viewport.width / 6), 0.08);
    const ty = THREE.MathUtils.lerp(group.current.position.y, pointer.y * strength * (viewport.height / 6), 0.08);
    group.current.position.x = tx;
    group.current.position.y = ty;

    const rx = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * 0.28, 0.06);
    const ry = THREE.MathUtils.lerp(group.current.rotation.y, -pointer.x * 0.5, 0.06);
    const rz = Math.sin(clock.getElapsedTime() * 0.08) * 0.02;
    group.current.rotation.set(rx, ry, rz);
  });

  return <group ref={group}>{children}</group>;
}

export const HeroScene: React.FC = () => {
  return (
    <div className="relative w-full h-[420px] md:h-[560px]">
      {/* subtle background gradient to avoid any square box around the canvas */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(60%_60%_at_70%_30%,hsl(var(--primary)/0.14),transparent_70%)]" />

      <Canvas gl={{ antialias: true, alpha: true }} dpr={[1, 2]} camera={{ position: [0, 0, 7], fov: 52 }} className="bg-transparent">
        <Suspense fallback={null}>
          {/* Lights */}
          <ambientLight intensity={0.28} />
          <pointLight position={[4, 6, 6]} intensity={2.2} color={'#a78bfa'} />
          <pointLight position={[-5, -2, -4]} intensity={1.3} color={'#22d3ee'} />
          <directionalLight intensity={0.12} />

          {/* Far stars for depth */}
          <Stars radius={60} depth={40} count={3000} factor={4} saturation={0} fade speed={0.5} />

          {/* Main interactive group */}
          <CursorParallax strength={0.18}>
            <Float speed={0.9} rotationIntensity={0.3} floatIntensity={0.3}>
              <group>
                <Moon scale={1.95} />
                <OrbitRing radius={2.9} speed={0.6} tilt={[Math.PI / 3.4, 0.1, 0.2]} color="#22d3ee" thickness={0.03} />
                <OrbitRing radius={2.45} speed={0.95} tilt={[0.25, 0.1, 0.42]} color="#a78bfa" thickness={0.025} />
                <OrbitRing radius={2.1} speed={1.4} tilt={[0.12, -0.2, 0.9]} color="#7c3aed" thickness={0.016} />
                <SparkCloud count={260} radius={4.6} />

                {/* Orbiting neon badges */}
                <OrbitBadge radius={3.2} speed={0.35} size={0.62} texture={btcSvg} />
                <OrbitBadge radius={2.6} speed={-0.5} size={0.5} texture={ethSvg} />
              </group>
            </Float>
          </CursorParallax>

          {/* Non-interactive HTML overlay placeholder */}
          <Html center style={{ pointerEvents: 'none' }}>
            <div style={{ width: 1 }} />
          </Html>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroScene;
