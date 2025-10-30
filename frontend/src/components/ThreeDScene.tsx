import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";

type ThreeDSceneProps = {
  className?: string;
};

function RotatingGlowSphere() {
  const meshRef = useRef<Mesh>(null);

  // Keep geometry/material stable for performance
  const args = useMemo(() => [1, 64, 64] as const, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.15; // slow, subtle rotation
    meshRef.current.rotation.x += delta * 0.05;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={args} />
      <meshStandardMaterial
        color="#F95700" // match login brand accent
        emissive="#F95700" // same brand color for subtle glow
        emissiveIntensity={0.8}
        roughness={0.2}
        metalness={0.1}
      />
    </mesh>
  );
}

export default function ThreeDScene({ className }: ThreeDSceneProps) {
  return (
    <div
      className={
        // transparent overlay that blends with dark mode
        (className ?? "") + " pointer-events-none w-full h-full bg-transparent"
      }
    >
      <Canvas
        // Transparent canvas to blend with existing background
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        frameloop="always"
      >
        {/* Subtle ambient base + a key light */}
        <ambientLight intensity={0.35} />
        <pointLight position={[2, 3, 2]} intensity={1.1} color="#F95700" />

        <RotatingGlowSphere />

        {/* Minimal controls for gentle auto-rotation feel; zoom disabled for UX */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
}
