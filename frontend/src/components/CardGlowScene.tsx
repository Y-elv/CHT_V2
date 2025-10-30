import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";

type CardGlowSceneProps = {
  className?: string;
  color?: string; // brand color, default to login accent
};

function RotatingTorus({ color = "#F95700" }: { color?: string }) {
  const meshRef = useRef<Mesh>(null);
  const args = useMemo(() => [1.2, 0.06, 32, 128] as const, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z += delta * 0.15;
    meshRef.current.rotation.x = 0.5;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <torusGeometry args={args} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        roughness={0.3}
        metalness={0.05}
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

export default function CardGlowScene({
  className,
  color = "#F95700",
}: CardGlowSceneProps) {
  return (
    <div
      className={
        (className ?? "") + " pointer-events-none w-full h-full bg-transparent"
      }
    >
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3], fov: 50 }}
        frameloop="always"
      >
        <ambientLight intensity={0.25} />
        <pointLight position={[1.5, 1.5, 1.5]} intensity={1.0} color={color} />
        <pointLight
          position={[-1.2, -1.0, 1.2]}
          intensity={0.6}
          color={color}
        />

        <RotatingTorus color={color} />
      </Canvas>
    </div>
  );
}
