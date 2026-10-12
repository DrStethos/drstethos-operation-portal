import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import { Box3, Vector3, type Group, type Object3D } from "three";
import { cn } from "@/lib/utils";

const MODEL_URL = "/assets/doctors_stethoscope.glb";

type OrbitLayer = "front" | "back";

type OrbitConfig = {
  radiusX: number;
  radiusY: number;
  radiusZ: number;
  modelScale: number;
};

/** Scroll-keyed waypoints around the card (normalized × radii). */
type Pose = { theta: number; yBoost: number };

/**
 * Step paths beside the step number (scroll-driven).
 * Orbit center is shifted right so the model sits next to "01 / 02 / …".
 * 1 top → right
 * 2 left-top → upper side
 * 3 left → right middle
 * 4 left-middle → front-right
 */
const STEP_PATHS: [Pose, Pose][] = [
  [
    { theta: 0.2, yBoost: 1.05 },
    { theta: Math.PI * 0.45, yBoost: 0.3 },
  ],
  [
    { theta: -Math.PI * 0.4, yBoost: 0.95 },
    { theta: -Math.PI * 0.55, yBoost: 0.2 },
  ],
  [
    { theta: -Math.PI * 0.45, yBoost: 0.05 },
    { theta: Math.PI * 0.45, yBoost: 0.05 },
  ],
  [
    { theta: -Math.PI * 0.4, yBoost: 0.0 },
    { theta: 0.35, yBoost: 0.1 },
  ],
];

function getOrbitConfig(): OrbitConfig {
  if (typeof window === "undefined") {
    return { radiusX: 1.35, radiusY: 0.5, radiusZ: 1.15, modelScale: 0.95 };
  }
  const w = window.innerWidth;
  if (w < 640) {
    return { radiusX: 0.95, radiusY: 0.35, radiusZ: 0.85, modelScale: 0.7 };
  }
  if (w < 1024) {
    return { radiusX: 1.15, radiusY: 0.42, radiusZ: 1.0, modelScale: 0.82 };
  }
  return { radiusX: 1.4, radiusY: 0.5, radiusZ: 1.2, modelScale: 0.95 };
}

type SharedOrbit = {
  config: OrbitConfig;
  reduced: boolean;
  active: boolean;
};

function normalizeModel(object: Object3D, targetSize = 1.05) {
  const box = new Box3().setFromObject(object);
  const size = box.getSize(new Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  object.scale.setScalar(targetSize / maxDim);
  object.updateMatrixWorld(true);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function poseFromScroll(progress: number): Pose {
  const p = Math.min(1, Math.max(0, progress));
  const seg = Math.min(3, Math.floor(p * 4));
  const local = p * 4 - seg;
  // Smoothstep within each step for calm cinematic motion
  const t = local * local * (3 - 2 * local);
  const [from, to] = STEP_PATHS[seg];
  return {
    theta: lerp(from.theta, to.theta, t),
    yBoost: lerp(from.yBoost, to.yBoost, t),
  };
}

function OrbitLights() {
  return (
    <>
      <ambientLight intensity={0.95} />
      <directionalLight position={[3.2, 4.2, 2.8]} intensity={1.35} />
      <directionalLight position={[-2.8, 1.4, -2.2]} intensity={0.45} />
    </>
  );
}

function OrbitingModel({
  shared,
  layer,
  scrollProgressRef,
}: {
  shared: MutableRefObject<SharedOrbit>;
  layer: OrbitLayer;
  scrollProgressRef?: MutableRefObject<number>;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const clone = useMemo(() => {
    const c = scene.clone(true);
    normalizeModel(c, 1.05);
    return c;
  }, [scene]);
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    const state = shared.current;
    const group = groupRef.current;
    if (!group || !state.active) return;

    const progress = state.reduced ? 0.08 : scrollProgressRef?.current ?? 0;
    const pose = poseFromScroll(progress);
    const { radiusX, radiusY, radiusZ, modelScale } = state.config;

    const x = radiusX * Math.sin(pose.theta) + 0.7; // sit beside the step number
    const y = radiusY * pose.yBoost;
    const z = radiusZ * Math.cos(pose.theta);

    group.position.set(x, y, z);
    group.rotation.set(0.1, pose.theta + Math.PI * 0.5, 0.03);
    group.scale.setScalar(modelScale);

    const inFront = z >= 0;
    group.visible = layer === "front" ? inFront : !inFront;
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={clone} />
      </Center>
    </group>
  );
}

function OrbitScene({
  shared,
  layer,
  scrollProgressRef,
}: {
  shared: MutableRefObject<SharedOrbit>;
  layer: OrbitLayer;
  scrollProgressRef?: MutableRefObject<number>;
}) {
  return (
    <>
      <OrbitLights />
      <Suspense fallback={null}>
        <OrbitingModel shared={shared} layer={layer} scrollProgressRef={scrollProgressRef} />
      </Suspense>
    </>
  );
}

type HowItWorksOrbitProps = {
  children: ReactNode;
  className?: string;
  scrollProgressRef?: MutableRefObject<number>;
};

/**
 * Dual-canvas 3D path: back WebGL → DOM card → front WebGL.
 * Position is scroll-keyed per step; Z depth toggles occlusion.
 */
const HowItWorksOrbit = ({ children, className, scrollProgressRef }: HowItWorksOrbitProps) => {
  const shared = useRef<SharedOrbit>({
    config: getOrbitConfig(),
    reduced: false,
    active: true,
  });
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    shared.current.reduced = reduced;
    shared.current.config = getOrbitConfig();

    const onResize = () => {
      shared.current.config = getOrbitConfig();
    };
    window.addEventListener("resize", onResize);

    const stage = stageRef.current;
    const io = stage
      ? new IntersectionObserver(
          ([entry]) => {
            shared.current.active = entry.isIntersecting;
          },
          { threshold: 0.02 }
        )
      : null;
    if (stage && io) io.observe(stage);

    return () => {
      window.removeEventListener("resize", onResize);
      io?.disconnect();
    };
  }, []);

  const canvasProps = {
    dpr: [1, 1.6] as [number, number],
    camera: { position: [0, 0.45, 5.8] as [number, number, number], fov: 34, near: 0.1, far: 40 },
    gl: { alpha: true, antialias: true, powerPreference: "high-performance" as const },
    style: { background: "transparent" as const },
  };

  return (
    <div
      ref={stageRef}
      className={cn(
        "relative isolate flex items-center justify-center min-h-[300px] sm:min-h-[340px] lg:min-h-[400px] overflow-visible",
        className
      )}
    >
      {/* Wide bleed so the model is not clipped */}
      <div
        className="pointer-events-none absolute -inset-[30%] sm:-inset-[36%] z-[5] overflow-visible"
        style={{ filter: "drop-shadow(0 18px 28px rgba(15,50,35,0.22))" }}
        aria-hidden="true"
      >
        <Canvas {...canvasProps}>
          <OrbitScene shared={shared} layer="back" scrollProgressRef={scrollProgressRef} />
        </Canvas>
      </div>

      {/* Step number / copy — opaque so the model can pass behind */}
      <div className="relative z-20 w-full">{children}</div>

      <div
        className="pointer-events-none absolute -inset-[30%] sm:-inset-[36%] z-[30] overflow-visible"
        style={{ filter: "drop-shadow(0 22px 34px rgba(15,50,35,0.28))" }}
        aria-hidden="true"
      >
        <Canvas {...canvasProps}>
          <OrbitScene shared={shared} layer="front" scrollProgressRef={scrollProgressRef} />
        </Canvas>
      </div>
    </div>
  );
};

useGLTF.preload(MODEL_URL);

export default HowItWorksOrbit;
