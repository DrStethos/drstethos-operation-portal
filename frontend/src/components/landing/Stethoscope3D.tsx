import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import { Box3, Vector3, type Group, type Object3D } from "three";
import { cn } from "@/lib/utils";

const MODEL_URL = "/assets/doctors_stethoscope.glb";

type ModelProps = {
  autoRotate?: boolean;
  spinSpeed?: number;
};

function normalizeModel(object: Object3D, targetSize = 1.55) {
  const box = new Box3().setFromObject(object);
  const size = box.getSize(new Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  object.scale.setScalar(targetSize / maxDim);
  object.updateMatrixWorld(true);
}

function StethoscopeModel({ autoRotate = true, spinSpeed = 0.35 }: ModelProps) {
  const { scene } = useGLTF(MODEL_URL);
  const clone = useMemo(() => {
    const c = scene.clone(true);
    normalizeModel(c, 1.55);
    return c;
  }, [scene]);
  const ref = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!autoRotate || !ref.current) return;
    ref.current.rotation.y += delta * spinSpeed;
  });

  return (
    <group ref={ref} rotation={[0.1, -0.4, 0.05]} scale={[1, 1, 1]}>
      <Center>
        <primitive object={clone} />
      </Center>
    </group>
  );
}

type Stethoscope3DProps = {
  className?: string;
  autoRotate?: boolean;
  spinSpeed?: number;
};

/**
 * Renders doctors_stethoscope.glb in a transparent WebGL canvas.
 * No Bounds clip — clipping planes were cropping the tubing on rotate.
 */
const Stethoscope3D = ({
  className,
  autoRotate = true,
  spinSpeed = 0.35,
}: Stethoscope3DProps) => {
  return (
    <div className={cn("h-full w-full overflow-visible", className)} aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.05, 3.4], fov: 32, near: 0.1, far: 60 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ background: "transparent", overflow: "visible" }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[3.5, 4, 2.5]} intensity={1.4} />
        <directionalLight position={[-2.5, 1.5, -2]} intensity={0.5} />
        <Suspense fallback={null}>
          <StethoscopeModel autoRotate={autoRotate} spinSpeed={spinSpeed} />
        </Suspense>
      </Canvas>
    </div>
  );
};

useGLTF.preload(MODEL_URL);

export default Stethoscope3D;
