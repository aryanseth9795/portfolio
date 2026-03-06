"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

interface OrbProps {
  position: [number, number, number];
  color: string;
  size?: number;
  speed?: number;
}

function Orb({ position, color, size = 0.3, speed = 1 }: OrbProps) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y =
        position[1] + Math.sin(clock.getElapsedTime() * speed) * 0.5;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={ref} position={position}>
        <dodecahedronGeometry args={[size, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
          wireframe
        />
      </mesh>
    </Float>
  );
}

export default function FloatingOrbs() {
  return (
    <group>
      <Orb position={[-6, 3, -5]} color="#00d4ff" size={0.4} speed={0.8} />
      <Orb position={[7, -2, -8]} color="#7c3aed" size={0.3} speed={1.2} />
      <Orb position={[4, 5, -6]} color="#39ff14" size={0.25} speed={1} />
      <Orb position={[-5, -4, -7]} color="#00d4ff" size={0.35} speed={0.9} />
      <Orb position={[8, 4, -10]} color="#7c3aed" size={0.2} speed={1.1} />
    </group>
  );
}
