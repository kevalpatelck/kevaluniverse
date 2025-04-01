import React, { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { TextureLoader } from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from 'three';


const Sun = () => {
  const sunRef=useRef();
  return (
    <>
    
     <EffectComposer>
        <Bloom intensity={0.5} radius={0.5} threshold={0.1} />
      </EffectComposer>
 <mesh ref={sunRef}>
        {/* Sun Sphere */}
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial
          color="orange"
          emissive="orange"
          emissiveIntensity={1.5}
        />
        {/* Sunlight */}
        <pointLight
          color="yellow"
          intensity={2}
          distance={30}  // Controls the reach of light
          decay={2}      // Controls how the light fades over distance
          position={[0, 0, 0]} // Position of the sun
        />
      </mesh>
    </>
  );
};

const Planet = ({ distance, size, texturePath, speed, hasRing, ringTexturePath }) => {
  const planetRef = useRef();
  const planetTexture = useLoader(TextureLoader, texturePath);
  const ringTexture = hasRing ? useLoader(TextureLoader, ringTexturePath) : null;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    planetRef.current.position.x = Math.cos(t) * distance;
    planetRef.current.position.z = Math.sin(t) * distance;
  });

  return (
    <group ref={planetRef}>
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial map={planetTexture} />
      </mesh>
      {hasRing && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[size * 1.8, 0.2, 16, 100]} />
          <meshStandardMaterial map={ringTexture} transparent={true} />
        </mesh>
      )}
    </group>
  );
};

const OrbitPath = ({ distance }) => {
  const points = [];
  for (let i = 0; i <= 100; i++) {
    const angle = (i / 100) * Math.PI * 2;
    points.push([Math.cos(angle) * distance, 0, Math.sin(angle) * distance]);
  }

  return (
    <line>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array(points.flat())}
          itemSize={3}
          count={points.length}
        />
      </bufferGeometry>
      <lineBasicMaterial attach="material" color="white" opacity={0.3} transparent />
    </line>
  );
};

const SolarSystem = () => {
  return (
    <Canvas style={{background:"black"}} camera={{ position: [0, 20, 50] }}>
      <Stars radius={500} depth={100} count={3000} factor={10} fade />
      <OrbitControls enableZoom enablePan enableRotate />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={2} />

      

      <Sun />

      {/* Planets with Realistic Textures */}
      <OrbitPath distance={6} />
      <Planet distance={6} size={0.5} texturePath="/textures/mercury.jpg" speed={0.8} />

      <OrbitPath distance={10} />
      <Planet distance={10} size={0.8} texturePath="/textures/venus.jpg" speed={0.6} />

      <OrbitPath distance={14} />
      <Planet distance={14} size={1} texturePath="/textures/earth.jpg" speed={0.5} />

      <OrbitPath distance={18} />
      <Planet distance={18} size={0.7} texturePath="/textures/mars.jpg" speed={0.4} />

      <OrbitPath distance={26} />
      <Planet distance={26} size={2.5} texturePath="/textures/jupiter.jpg" speed={0.2} />

      <OrbitPath distance={34} />
      <Planet
        distance={34}
        size={2}
        texturePath="/textures/saturn.jpg"
        speed={0.15}
        hasRing={true}
        ringTexturePath="/textures/saturn_ring.png"
      />

      <OrbitPath distance={40} />
      <Planet distance={40} size={1.5} texturePath="/textures/uranus.jpg" speed={0.12} />

      <OrbitPath distance={46} />
      <Planet distance={46} size={1.4} texturePath="/textures/neptune.jpg" speed={0.1} />

 



    </Canvas>
  );
};

export default SolarSystem;
