import { Component, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { AnimationPhase, VisualEffects } from "../types";

interface LabScene3DProps {
  effects: VisualEffects;
  phase: AnimationPhase;
  contentsLabel: string;
}

class SceneErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function hexToThreeColor(colorValue: string) {
  if (colorValue.startsWith("linear-gradient")) {
    return new THREE.Color("#6fb9ff");
  }

  return new THREE.Color(colorValue);
}

function BubbleParticles({ bubbleLevel }: { bubbleLevel: VisualEffects["bubbleLevel"] }) {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => ({
        id: index,
        x: ((index % 4) - 1.5) * 0.28,
        z: (Math.floor(index / 4) - 1.5) * 0.2,
        offset: (index % 5) * 0.33,
        scale: 0.04 + (index % 3) * 0.012
      })),
    []
  );

  if (bubbleLevel === 0) {
    return null;
  }

  return (
    <group position={[0, -0.65, 0]}>
      {bubbles.map((bubble) => (
        <Bubble key={bubble.id} bubble={bubble} speed={0.45 + bubbleLevel * 0.4} />
      ))}
    </group>
  );
}

function Bubble({
  bubble,
  speed
}: {
  bubble: { x: number; z: number; offset: number; scale: number };
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) {
      return;
    }

    const elapsed = (clock.getElapsedTime() * speed + bubble.offset) % 1;
    ref.current.position.set(
      bubble.x + Math.sin(elapsed * Math.PI * 2) * 0.025,
      -0.04 + elapsed * 1.15,
      bubble.z
    );
    ref.current.scale.setScalar(bubble.scale * (0.9 + elapsed * 0.4));
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshPhysicalMaterial color="#ffffff" transparent opacity={0.45} roughness={0.1} transmission={0.9} />
    </mesh>
  );
}

function FoamLayer({ visible }: { visible: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current || !visible) {
      return;
    }

    ref.current.position.y = -0.08 + Math.sin(clock.getElapsedTime() * 3) * 0.015;
    ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 1.4) * 0.03;
  });

  if (!visible) {
    return null;
  }

  return (
    <mesh ref={ref} position={[0, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.8, 48]} />
      <meshStandardMaterial color="#f8ffff" transparent opacity={0.8} />
    </mesh>
  );
}

function Precipitate({ visible }: { visible: boolean }) {
  if (!visible) {
    return null;
  }

  return (
    <mesh position={[0, -0.95, 0]}>
      <cylinderGeometry args={[0.72, 0.6, 0.18, 32]} />
      <meshStandardMaterial color="#edf1e8" roughness={0.95} />
    </mesh>
  );
}

function ReactionGlow({ visible }: { visible: boolean }) {
  const ref = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!ref.current) {
      return;
    }

    ref.current.intensity = visible ? 1.4 + Math.sin(clock.getElapsedTime() * 4) * 0.35 : 0;
  });

  return <pointLight ref={ref} position={[0, 1.1, 0.8]} color="#ff8ec2" distance={4} intensity={0} />;
}

function Bottle({
  color,
  position,
  active
}: {
  color: string;
  position: [number, number, number];
  active: boolean;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.44, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 0.22, 32]} />
        <meshStandardMaterial color="#dde7f5" metalness={0.2} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.24, 0.78, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={0.08}
          roughness={0.28}
          transparent
          opacity={active ? 0.96 : 0.82}
        />
      </mesh>
      <mesh position={[0, -0.08, 0.26]}>
        <planeGeometry args={[0.36, 0.18]} />
        <meshStandardMaterial color={active ? "#fff4c1" : "#f8fbff"} />
      </mesh>
    </group>
  );
}

function PourStream({ phase, tint }: { phase: AnimationPhase; tint: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const visible = phase === "pouring";

  useFrame(({ clock }) => {
    if (!ref.current || !visible) {
      return;
    }

    ref.current.scale.y = 0.8 + Math.sin(clock.getElapsedTime() * 9) * 0.08;
  });

  if (!visible) {
    return null;
  }

  return (
    <mesh ref={ref} position={[-1.25, 0.42, 0]} rotation={[0, 0, -0.28]}>
      <cylinderGeometry args={[0.04, 0.06, 1.4, 16]} />
      <meshStandardMaterial color={tint} emissive={tint} emissiveIntensity={0.2} transparent opacity={0.7} />
    </mesh>
  );
}

function Liquid({ effects, phase }: { effects: VisualEffects; phase: AnimationPhase }) {
  const ref = useRef<THREE.Mesh>(null);
  const color = useMemo(() => hexToThreeColor(effects.liquidColor), [effects.liquidColor]);

  useFrame(({ clock }) => {
    if (!ref.current) {
      return;
    }

    const activity =
      phase === "reacting" ? 0.12 : phase === "mixing" ? 0.08 : phase === "pouring" ? 0.05 : effects.swirl ? 0.04 : 0.02;
    ref.current.position.y = -0.65 + Math.sin(clock.getElapsedTime() * 2.8) * activity;
    ref.current.rotation.z = effects.swirl ? Math.sin(clock.getElapsedTime() * 1.6) * 0.03 : 0;
  });

  return (
    <mesh ref={ref} position={[0, -0.65, 0]}>
      <cylinderGeometry args={[0.82, 0.72, 1.15, 48]} />
      <meshStandardMaterial
        color={color}
        emissive={effects.glow ? color.clone().multiplyScalar(0.28) : new THREE.Color("#000000")}
        metalness={0.02}
        roughness={0.18}
        transparent
        opacity={0.92}
      />
    </mesh>
  );
}

function Beaker({ effects, phase }: { effects: VisualEffects; phase: AnimationPhase }) {
  return (
    <group position={[0, 0.1, 0]}>
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[1, 0.88, 2.28, 56, 1, true]} />
        <meshStandardMaterial color="#7ba7c7" wireframe transparent opacity={0.22} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.96, 0.84, 2.25, 56, 1, true]} />
        <meshPhysicalMaterial
          color="#e8f7ff"
          roughness={0.08}
          transmission={1}
          thickness={0.45}
          transparent
          opacity={0.4}
        />
      </mesh>
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[0.84, 0.72, 0.08, 56]} />
        <meshPhysicalMaterial color="#dff3ff" roughness={0.12} transmission={0.85} transparent opacity={0.55} />
      </mesh>
      <mesh position={[0, 1.08, 0]}>
        <torusGeometry args={[0.92, 0.05, 18, 64]} />
        <meshStandardMaterial color="#f7fdff" metalness={0.25} roughness={0.14} />
      </mesh>
      <Liquid effects={effects} phase={phase} />
      <FoamLayer visible={effects.foam} />
      <Precipitate visible={effects.precipitate} />
      <BubbleParticles bubbleLevel={effects.bubbleLevel} />
    </group>
  );
}

function LabScene({ effects, phase, contentsLabel }: LabScene3DProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <Canvas camera={{ position: [0, 1.3, 5.2], fov: 38 }} dpr={[1, 1.5]}>
      <color attach="background" args={["#dfefff"]} />
      <fog attach="fog" args={["#dfefff", 7, 16]} />
      <ambientLight intensity={0.95} />
      <hemisphereLight intensity={1.05} color="#f7fcff" groundColor="#9ec6e8" />
      <directionalLight position={[4, 6, 4]} intensity={1.9} castShadow />
      <spotLight position={[-4, 5, 3]} intensity={1.3} angle={0.35} penumbra={0.6} />
      <ReactionGlow visible={effects.glow || phase === "reacting"} />

      <mesh position={[0, -1.9, -1.15]} rotation={[-Math.PI / 2.2, 0, 0]}>
        <planeGeometry args={[8.5, 5.6]} />
        <meshStandardMaterial color="#d3ebff" />
      </mesh>
      <mesh position={[0, -1.55, 0]}>
        <boxGeometry args={[7.4, 0.34, 4.8]} />
        <meshStandardMaterial color="#b67d48" roughness={0.72} />
      </mesh>
      <mesh position={[0, -1.34, 0]}>
        <boxGeometry args={[7.45, 0.03, 4.85]} />
        <meshStandardMaterial color="#d7a777" roughness={0.34} />
      </mesh>

      <group rotation={[0.08, reducedMotion ? 0 : 0.12, 0]}>
        <Beaker effects={effects} phase={phase} />
      </group>

      <Bottle color="#f0c078" position={[-2.25, -0.2, 0.35]} active={phase === "pouring"} />
      <Bottle color="#8cc6ff" position={[2.1, -0.24, -0.25]} active={phase === "mixing" || phase === "reacting"} />
      <PourStream phase={phase} tint={effects.liquidColor.startsWith("#") ? effects.liquidColor : "#7fc5ff"} />

      <OrbitControls
        enablePan={false}
        enableDamping
        minDistance={4}
        maxDistance={7.5}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 1.95}
      />
    </Canvas>
  );
}

export default function LabScene3D(props: LabScene3DProps) {
  return (
    <SceneErrorBoundary
      fallback={
        <div className="lab-scene-fallback" aria-label="3D chemistry lab fallback">
          <strong>3D view unavailable</strong>
          <span>The experiment is still active. Try refreshing or using a browser with WebGL enabled.</span>
        </div>
      }
    >
      <div className="lab-scene-canvas" aria-label="3D chemistry lab scene">
        <LabScene {...props} />
        <div className="lab-scene-overlay">
          <strong>3D Reaction View</strong>
          <span>{props.contentsLabel}</span>
        </div>
      </div>
    </SceneErrorBoundary>
  );
}
