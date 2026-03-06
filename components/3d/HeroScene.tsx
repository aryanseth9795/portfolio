"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function MorphingSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.2, 20]} />
        <MeshDistortMaterial
          color="#00d4ff"
          emissive="#7c3aed"
          emissiveIntensity={0.15}
          roughness={0.3}
          metalness={0.8}
          distort={0.35}
          speed={1.5}
          wireframe
        />
      </mesh>
    </Float>
  );
}

function OrbitingSymbols() {
  const groupRef = useRef<THREE.Group>(null);
  const symbols = useMemo(() => ["</>", "{ }", "()=>", "[]", "&&", "//"], []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.3;
      groupRef.current.rotation.x =
        Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {symbols.map((_, i) => {
        const angle = (i / symbols.length) * Math.PI * 2;
        const radius = 3.5;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(i * 0.8) * 0.8,
              Math.sin(angle) * radius,
            ]}
          >
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? "#00d4ff" : "#7c3aed"}
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function InnerGlow() {
  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.08} />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      style={{ background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#00d4ff" />
      <pointLight position={[-5, -5, -5]} intensity={0.4} color="#7c3aed" />

      <MorphingSphere />
      <OrbitingSymbols />
      <InnerGlow />

      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
